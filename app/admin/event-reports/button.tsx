'use client'

import React from 'react'
import { useState } from 'react';

const Btnupload = () => {

    const [file, setFile] = useState<File | null>(null);
    
      const upload = async () => {
        if (!file) return;
    
        const formData = new FormData();
        formData.append("pdf", file);
    
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          cache: "no-store",
        });
    
        const data = await res.json();
        alert(data.message);
      };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={upload}>Upload</button>
    </div>
  )
}

export default Btnupload