"use client"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "./components/Navbar"
import SkeletonCard from "./components/SkeletonCard"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mb-4 sm:mb-0"></div>
          <div className="h-10 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center items-center mt-12"
        >
          <Loader2 className="h-12 w-12 animate-spin text-[#f6c90e]" />
        </motion.div>
      </div>
    </div>
  )
}