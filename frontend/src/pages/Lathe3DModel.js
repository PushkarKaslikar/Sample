import React, { useState } from 'react';

const LATHE_COMPONENTS = [
  {
    id: 1,
    name: "Control Panel (CNC Controller)",
    description: "Control Panel is known as the Brain of CNC machine. It is used to execute or run CNC programs written using G-Codes And M-codes. Operators can control whole machine processes using this control panel. Spindle speed, Feed rate, tool movements, and other machine operations were controlled using Control Panel. It also displays machine status, error messages and operation time. The control panel is essential because it allows us to accurate and automated control of the machine processes. ",
    image: "./images/control_panel.png"
  },
  {
    id: 2,
    name: "Spindle",
    description: "Spindle is the rotating component that drives the chuck and the workpiece. It rotates at different speed which can be controlled by using control panel programs. The spindle speed directly affects on the cutting quality and surface finish after the operation done. The spindle is important because it provide necessary rotational movements which required for different operations.",
    image: "./images/spindle.png"
  },
  {
    id: 3,
    name: "Chuck",
    description: "Chuck is the mounted on the spindle and it only use to hold the workpiece properly during machining operations. Mostly the Three-jaw and Four-jaw type of chuck is used. A properly clamped workpiece ensures accurate machining and prevents slippage during operations. The chuck is essential for maintaining safety during operations.",
    image: "./images/chuck.png"
  },
  {
    id: 4,
    name: "Tool post or Tool Turret",
    description: "The Tool post is use to hold one or more cutting tools. In CNC machines, The turret automatically indexes and changes the tools as per the program is given. This allows multiple operations which requires different tools are performed without manual efforts. The tool turret improves the productivity and working efficiency as well as reduces the worker fatigue.",
    image: "./images/tool_post.png"
  },
  {
    id: 5,
    name: "Bed",
    description: "Bed is the base structure of the CNC machine. It supports all the major components such as headstock, Tailstock, and Carriage. The bed provide rigid base and maintain alignment of machine parts. A strong and rigid bed is necessary to reduce the vibration causing during operations and ensure the accurate machining.",
    image: "./images/bed.png"
  },
  {
    id: 6,
    name: "Carriage",
    description: "The carriage moves all along the bed and carries the cutting tools during machining. It allows  controlled movement of the tool in longitudinal and transverse direction. The carriage is fully driven by Servo Motors for precise positioning. It plays important role in shaping the workpiece accurately.",
    image: "./images/carriage.png"
  },
  {
    id: 7,
    name: "Tailstock",
    description: "The tailstock is located at the opposite side of the headstock and is used to support long workpieces. It can also hold drilling and boring tools. The tailstock improves stability of workpiece while being machining. And prevents bending of workpiece during operations.",
    image: "./images/tailstock.png"
  },
  {
    id: 8,
    name: "Safety Enclosure (Body)",
    description: "The safety enclosure is the main outer body of the machine which surrounds the machine area to protect the operator form falling chips, coolant splashes, and accidental contact caused by the moving parts. It is an important safety feature that completely ensure the safety and compliance with industrial safety standards.",
    image: "./images/safety.png"
  }
];

const FLOW_STEPS = [
  "Start / Power ON machine",
  "Load CNC program (G-code)",
  "Workpiece clamped in chuck",
  "Tool selected from tool turret",
  "Set spindle speed & feed rate",
  "Tool moves as per program",
  "Machining operation performed",
  "Machine stops / End"
];

const DOS = [
  {
    title: "Wear Proper Safety Equipment",
    description: "Always wear safety goggles, safety shoes, and protective clothing before operating the CNC lathe to protect against chips and coolant splashes."
  },
  {
    title: "Check Workpiece Clamping",
    description: "Ensure the workpiece is properly and firmly clamped in the chuck before starting the machine to avoid vibration or ejection."
  },
  {
    title: "Verify CNC Program Before Execution",
    description: "Always check the CNC program for correct G-codes, tool paths, spindle speed, and feed rate before running the machine."
  },
  {
    title: "Perform Dry Run",
    description: "Run the program in dry-run or simulation mode to confirm tool movement and avoid collisions."
  },
  {
    title: "Keep Machine Area Clean",
    description: "Maintain cleanliness around the machine to prevent accidents and ensure smooth operation."
  },
  {
    title: "Use Proper Cutting Tools",
    description: "Select the correct tool type and tool holder for the machining operation to achieve good surface finish and tool life."
  }
];

const DONTS = [
  {
    title: "Do Not Touch Rotating Parts",
    description: "Never touch the rotating chuck, spindle, or workpiece while the machine is running."
  },
  {
    title: "Do Not Leave Chuck Key in Chuck",
    description: "Always remove the chuck key after tightening to avoid serious accidents."
  },
  {
    title: "Do Not Change Tools During Operation",
    description: "Tool changes should only be done when the machine is completely stopped."
  },
  {
    title: "Do Not Open Safety Door While Running",
    description: "Never open the safety enclosure door during machining, as chips and coolant can cause injury."
  },
  {
    title: "Do Not Use Incorrect Parameters",
    description: "Avoid using incorrect spindle speed or feed rate, as it can damage tools and workpieces."
  },
  {
    title: "Do Not Ignore Alarms or Warnings",
    description: "Never ignore machine alarms or error messages; stop the machine and identify the issue."
  }
];

function Lathe3DModel() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeVal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white overflow-y-auto">
      <div className="container mx-auto px-4 py-8">

        {/* 3D Model Section */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Interactive 3D Model
          </h2>
          <iframe
            title="Turning Lathe CNC CORMAK"
            src="https://sketchfab.com/models/703388fd52ee424e8c0ad2d8dc662090/embed"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            className="w-full h-[500px] md:h-[600px] rounded-xl border-none"
          />
          <p className="text-center text-sm text-gray-400 mt-4">
            <a
              href="https://sketchfab.com/3d-models/turning-lathe-cnc-cormak-703388fd52ee424e8c0ad2d8dc662090"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold hover:underline"
            >
              Turning Lathe CNC CORMAK
            </a> by <a href="https://sketchfab.com/omg3d" target="_blank" rel="noreferrer" className="text-cyan-400 font-semibold hover:underline">omg3d</a>
          </p>
        </div>

        {/* Components Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Machine Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LATHE_COMPONENTS.map((component) => (
              <div
                key={component.id}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {/* Image Container */}
                <div
                  className="relative h-80 overflow-hidden bg-black/20 cursor-pointer"
                  onClick={() => handleImageClick(component.image)}
                >
                  <img
                    src={component.image}
                    alt={component.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Click to Enlarge
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-cyan-100 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {component.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {component.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step by Step Flow Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Step by Step Flow
          </h2>

          <div className="max-w-2xl mx-auto">
            {FLOW_STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step Box */}
                <div
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group cursor-default"
                >
                  <span className="text-xl font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {step}
                  </span>
                </div>

                {/* Arrow Connector (show for all except last item) */}
                {index < FLOW_STEPS.length - 1 && (
                  <div className="h-12 w-px bg-gradient-to-b from-white/20 to-cyan-400/50 my-2 relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <svg
                        className="w-4 h-4 text-cyan-400/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dos and Donts Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* DOS Section */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              DOs of CNC Lathe
            </h2>
            <div className="space-y-6">
              {DOS.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-100 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-green-200/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DONTS Section */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              DON'Ts of CNC Lathe
            </h2>
            <div className="space-y-6">
              {DONTS.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-100 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-red-200/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300"
          onClick={closeVal}
        >
          <div className="relative max-w-7xl w-full max-h-screen flex items-center justify-center">
            <button
              className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
              onClick={closeVal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Lathe3DModel;
