import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { FaSearchPlus, FaSearchMinus, FaUndo, FaExpand } from "react-icons/fa"; // Added FaExpand

function ImageViewerDialog({ imageUrl, onClose }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const viewer = OpenSeadragon({
      element: containerRef.current,
      tileSources: {
        type: "image",
        url: imageUrl,
      },
      showNavigationControl: false,
      minZoomImageRatio: 0.5,
      maxZoomPixelRatio: 3,
      defaultZoomLevel: 1,
      zoomPerClick: 1.2,
      zoomPerScroll: 1.1,
      gestureSettingsMouse: {
        scrollToZoom: true,
        clickToZoom: false,
        dragToPan: true,
      },
    });

    viewerRef.current = viewer;

    viewer.addHandler("open", () => {
      canvasRef.current = viewer.drawer.canvas;
      canvasRef.current.style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    });

    return () => {
      viewer.destroy();
    };
  }, [imageUrl]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
      canvasRef.current.style.transition = "filter 0.1s ease";
    }
  }, [contrast, brightness]);

  const handleZoomIn = () => {
    viewerRef.current.viewport.zoomBy(1.2);
  };

  const handleZoomOut = () => {
    viewerRef.current.viewport.zoomBy(0.8);
  };

  const handleReset = () => {
    setContrast(100);
    setBrightness(100);
    viewerRef.current.viewport.goHome();
  };

  const handleFullScreen = () => {
    if (viewerRef.current) {
      const newFullScreenState = !isFullScreen;
      viewerRef.current.setFullScreen(newFullScreenState);
      setIsFullScreen(newFullScreenState);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Image Viewer</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div ref={containerRef} className="w-full h-[60vh] bg-gray-100"></div>
        <div className="mt-4 space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all flex items-center space-x-1"
            >
              <FaSearchPlus className="text-lg" />
              <span>Zoom In</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all flex items-center space-x-1"
            >
              <FaSearchMinus className="text-lg" />
              <span>Zoom Out</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all flex items-center space-x-1"
            >
              <FaUndo className="text-lg" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleFullScreen}
              className="p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all flex items-center space-x-1"
            >
              <FaExpand className="text-lg" />
              <span>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contrast: {contrast}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brightness: {brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageViewerDialog;
