import CameraCompo from "@/components/CameraCompo";
import CameraComponent from "@/components/CameraComponent"; // Adjust path if needed

const FakeDetPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Upload or Capture an Image</h1>
      <CameraCompo/>
    </div>
  );
};

export default FakeDetPage;