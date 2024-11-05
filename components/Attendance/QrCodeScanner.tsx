import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Message } from "@arco-design/web-react";
import App from "@/app/(site)/api/api";
import { useAuth } from "@/context/Auth";

interface QRData {
  schedule_id: number;
  course_code: string;
  course_name: string;
  instructor_id: number;
  token: string;
  generated_at: string;
  room: string;
  semester: string;
  year: string;
}

const QRScanner: React.FC = () => {
  const [data, setData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const { user } = useAuth();
  const user_id = user?.id;

  const handleScan = async (detectedCodes: Array<{ rawValue: string }>) => {
    const result = detectedCodes[0]?.rawValue;
    if (result && isScanning) {
      setIsScanning(false);
      console.log(result);

      try {
        const qrData: QRData = JSON.parse(result);
        setData(qrData);
        await submitAttendance(qrData);
      } catch (err) {
        setError("Invalid QR code format");
        Message.error("Invalid QR code format");
        console.error(err);
        setIsScanning(true);
      }
    }
  };

  const submitAttendance = async (qrData: QRData) => {
    setLoading(true);
    setError(null);

    try {
      // Send user ID along with QR data
      const response = await App.post("/api/verify-qr/", {
        qrData,
        id: user_id,  // Include user ID in the payload
      });

      if (response.data.success) {
        Message.success("Attendance marked successfully");
      } else {
        setError(response.data.message || "Failed to mark attendance");
        Message.error(response.data.message || "Failed to mark attendance");
        setIsScanning(true);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit attendance";
      setError(errorMessage);
      Message.error(errorMessage);
      setIsScanning(true); 
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    const errorMessage = "Error accessing camera: " + (err instanceof Error ? err.message : String(err));
    setError(errorMessage);
    Message.error(errorMessage);
    console.error(err);
    setIsScanning(true);
  };

  const resetScanner = () => {
    setData(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {isScanning && (
        <div className="w-full max-w-lg overflow-hidden rounded-lg bg-black">
          <Scanner
            onScan={handleScan}
            onError={handleError}
            constraints={{
              facingMode: "environment",
            }}
            scanDelay={1000}
          />
        </div>
      )}

      {error && (
        <div className="w-full max-w-lg">
          <Message type="error">{error}</Message>
          <Button type="primary" onClick={resetScanner} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {loading && <Message type="loading">Processing attendance...</Message>}

      {data && !error && !loading && (
        <div className="w-full max-w-lg">
          <Message type="success">
            <div>
              <p>Successfully scanned course:</p>
              <p className="font-bold">{data.course_name}</p>
              <p className="text-sm">Course Code: {data.course_code}</p>
              <p className="text-sm">Room: {data.room}</p>
              <p className="text-sm">
                Semester: {data.semester} {data.year}
              </p>
            </div>
          </Message>
          <Button type="primary" onClick={resetScanner} className="mt-2">
            Scan Another
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
