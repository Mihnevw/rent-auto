"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 ">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        
        {/* Main content */}
        <motion.div 
          className="relative text-center bg-background/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#c4ec64] max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Car icon with circular background */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
            <div className="relative flex items-center justify-center w-full h-full">
              <Car className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Error message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-lg font-medium text-muted-foreground mb-2 block">
              {t("oops")}
            </span>
            <h1 className="text-7xl font-bold text-primary mb-2 font-mono tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold mb-3 text-foreground">{t("pageNotFound")}</h2>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-muted-foreground mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("pageNotFoundDescription")}
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/">
              <Button 
                variant="default" 
                size="lg"
                className="px-8 py-6 text-lg hover:scale-105 transition-transform bg-gradient-to-r from-blue-500 to-green-500 text-white"
              >
                {t("returnToHomepage")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 