"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, MapPin, Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 🖼️ Import all your assets
import main1 from "@/assets/main1.png";
import upload2 from "@/assets/upload2.svg";
import map1 from "@/assets/map1.svg";
import group1 from "@/assets/group1.svg";
import ai2 from "@/assets/ai2.svg";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-blue-50 to-purple-50">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Organize Your Memories Intelligently
        </motion.h1>

        <motion.p
          className="text-gray-600 max-w-2xl mb-8 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Upload your photos, and let AI do the rest — extract metadata, detect faces, generate captions,
          and let you search through memories like never before.
        </motion.p>

        <motion.button
          onClick={() => router.push("/upload")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition flex items-center gap-2"
          whileTap={{ scale: 0.95 }}
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Hero Image */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Image
            src={main1}
            alt="AI analyzing photos illustration"
            className="w-full max-w-4xl rounded-3xl shadow-xl"
            priority
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-semibold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Makes MemoLens Smart
        </motion.h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16">
          Our intelligent photo processing pipeline makes your image collection searchable and meaningful.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: <Upload className="w-10 h-10 text-blue-500 mb-4" />,
              title: "Seamless Uploads",
              desc: "Upload multiple images in one go — supports JPG, PNG, HEIC, and HEIF formats.",
              img: upload2,
              alt: "Photo upload feature illustration",
            },
            {
              icon: <MapPin className="w-10 h-10 text-green-500 mb-4" />,
              title: "Smart Location Extraction",
              desc: "Automatically extract GPS data from metadata and tag your photos by place.",
              img: map1,
              alt: "Location detection feature illustration",
            },
            {
              icon: <Brain className="w-10 h-10 text-purple-500 mb-4" />,
              title: "Face Recognition",
              desc: "Detect and group familiar faces using advanced AI models.",
              img: group1,
              alt: "Face recognition feature illustration",
            },
            {
              icon: <Search className="w-10 h-10 text-pink-500 mb-4" />,
              title: "AI-Powered Search",
              desc: "Search photos by captions, locations, or even who’s in them — just like chatting with an assistant.",
              img: ai2,
              alt: "AI search feature illustration",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
              <p className="text-gray-500 text-sm mb-6">{f.desc}</p>
              <div className="w-full h-40 relative">
                <Image
                  src={f.img}
                  alt={f.alt}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <motion.h3
          className="text-3xl font-semibold mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Ready to Explore Your Memories Smarter?
        </motion.h3>
        <motion.button
          onClick={() => router.push("/upload")}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition"
        >
          Get Started
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 border-t mt-8 text-sm">
        © {new Date().getFullYear()} MemoLens — Built with ❤️ using AI
      </footer>
    </div>
  );
}
