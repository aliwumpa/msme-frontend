import Header from "@/components/Header/Header";
import UploadBox from "@/components/UploadBox";

export default function Home() {
  return (
    <div className="msme__outer-wrapper">
      <Header />
      <main className="msme__main">
        <div className="msme__main-title-wrapper">
          <h1>Invoice Verification</h1>
          <p>Precision processing for secure financial operations.</p>
        </div>
        <UploadBox />
      </main>
    </div>
  );
}
