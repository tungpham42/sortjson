import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";

const JsonSorter = () => {
  const [jsonData, setJsonData] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [keys, setKeys] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedData = JSON.parse(e.target.result);
          if (
            Array.isArray(parsedData) &&
            parsedData.length > 0 &&
            typeof parsedData[0] === "object"
          ) {
            setJsonData(parsedData);
            setKeys(Object.keys(parsedData[0]));
            setSelectedKey("");
          } else {
            alert("Invalid JSON format. Please upload an array of objects.");
          }
        } catch (error) {
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSort = () => {
    if (!selectedKey) return;
    let sortedData = [...jsonData].sort((a, b) =>
      a[selectedKey]?.toString().localeCompare(b[selectedKey]?.toString())
    );

    // Reorder ID if it exists
    if (sortedData.length > 0 && "id" in sortedData[0]) {
      sortedData = sortedData.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    }

    setJsonData(sortedData);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sorted_data.json";
    link.click();
  };

  return (
    <Container className="mt-4">
      <h2>JSON Sorter</h2>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload JSON File</Form.Label>
        <Form.Control type="file" accept=".json" onChange={handleFileUpload} />
      </Form.Group>
      {keys.length > 0 && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Select Key to Sort</Form.Label>
            <Form.Select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            >
              <option value="">Select Key</option>
              {keys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={handleSort} className="me-2">
            Sort
          </Button>
          <Button variant="success" onClick={handleDownload}>
            Download JSON
          </Button>
        </>
      )}
      {jsonData.length > 0 && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              {keys.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.map((item, index) => (
              <tr key={index}>
                {keys.map((key) => (
                  <td key={key}>
                    {typeof item[key] === "object"
                      ? JSON.stringify(item[key])
                      : item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default JsonSorter;
