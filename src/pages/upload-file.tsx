'use client';

import { useState } from 'react';

import Layout from "@/src/components/Layout";
import FileUploader from "@/src/components/FileUploader";

const UploadFile = () => {
    const [proceeded, setProceeded] = useState(false);

    return (
      <Layout>
        <div>
            {!proceeded ? (
              <FileUploader onNext={() => setProceeded(true)} />
            ) : (
              <div className="h-screen flex items-center justify-center">
                  <h1 className="text-2xl font-bold text-green-600">Proceeding to Next Stage 🚀</h1>
              </div>
            )}
        </div>
      </Layout>
    );
}

export default UploadFile