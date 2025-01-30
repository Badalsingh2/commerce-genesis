"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CameraCompo = () => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('camera')
  const [cameraPermission, setCameraPermission] = useState<PermissionState>('prompt')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Check camera permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setCameraPermission(permission.state)
        permission.onchange = () => setCameraPermission(permission.state)
      } catch (error) {
        console.error('Error checking camera permission:', error)
      }
    }
    checkPermission()
  }, [])

  // Handle camera initialization when tab changes
  useEffect(() => {
    if (activeTab === 'camera' && open) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [activeTab, open])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setIsLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        await videoRef.current.play()
      }
      setCameraPermission('granted')
    } catch (error) {
      console.error('Error starting camera:', error)
      setCameraPermission('denied')
      alert('Failed to access camera. Please check your camera permissions.')
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      stopCamera()
      setSelectedImage(null)
    }
  }

  const captureImage = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setSelectedImage(imageDataUrl)
        stopCamera()
      }
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string
        setSelectedImage(imageDataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return;
  
    setIsLoading(true);
    try {
      // Convert base64 to blob
      const base64Data = selectedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
  
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
  
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('http://127.0.0.1:8000/upload/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
  
        // Print the response
        console.log("Server Response:", result);
  
        // Optionally, display the response in the UI
        alert(`Upload successful! Label: ${result.label}, Image URL: ${result.image_url}`);
  
        setOpen(false);
      } else {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (activeTab === 'camera') {
      startCamera()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogTrigger asChild>
          <Button size="icon" className="absolute right-0 w-11 h-11 rounded-md bg-primary">
            <Camera className="h-5 w-5 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">Upload or Capture Image</DialogTitle>
          </DialogHeader>
          <Tabs
            defaultValue="camera"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setSelectedImage(null)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="camera" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Camera
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-4">
              <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                {!selectedImage ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {!selectedImage ? (
                <Button
                  onClick={captureImage}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading || cameraPermission !== 'granted'}
                >
                  {isLoading ? 'Starting Camera...' : 'Capture Image'}
                </Button>
              ) : (
                <Button
                  onClick={handleUpload}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Uploading...' : 'Upload Image'}
                </Button>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              {!selectedImage ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <label className="w-full">
                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CameraCompo