import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";

export default function App() {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState([]);
  const [mode, setMode] = useState("encrypt");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleProcess = async () => {
    if (!password) {
      alert("Please enter a password first!");
      return;
    }

    let newResults = [];

    for (let file of files) {
      const text = await file.text();
      let processed;

      if (mode === "encrypt") {
        processed = CryptoJS.AES.encrypt(text, password).toString();
      } else {
        try {
          const bytes = CryptoJS.AES.decrypt(text, password);
          processed = bytes.toString(CryptoJS.enc.Utf8);
          if (!processed) throw new Error("Wrong password!");
        } catch {
          alert(`Failed to decrypt ${file.name}. Wrong password?`);
          continue;
        }
      }

      const blob = new Blob([processed], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${file.name}.${mode}ed.txt`);

      newResults.push({ name: file.name, status: "done" });
    }

    setResult(newResults);
  };

  const checkStrength = (pwd) => {
    if (pwd.length < 6) return "Weak";
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd))
      return "Strong";
    return "Medium";
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center p-6 font-mono">
      <h1 className="text-2xl font-bold mb-4">🔒 File Encryptor</h1>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="mb-4 text-white"
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 px-3 py-2 rounded bg-gray-900 text-white w-64"
      />
      {password && (
        <p className="mb-4">
          Strength:{" "}
          <span
            className={
              checkStrength(password) === "Weak"
                ? "text-red-500"
                : checkStrength(password) === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }
          >
            {checkStrength(password)}
          </span>
        </p>
      )}

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("encrypt")}
          className={`px-4 py-2 rounded ${
            mode === "encrypt" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          Encrypt
        </button>
        <button
          onClick={() => setMode("decrypt")}
          className={`px-4 py-2 rounded ${
            mode === "decrypt" ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          Decrypt
        </button>
      </div>

      <button
        onClick={handleProcess}
        className="px-6 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400"
      >
        {mode === "encrypt" ? "Encrypt Files" : "Decrypt Files"}
      </button>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Results</h2>
        <ul>
          {result.map((r, i) => (
            <li key={i} className="text-sm">
              ✅ {r.name} {mode}ed
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
    }
