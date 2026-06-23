import { motion } from "framer-motion";

/**
 * ShinyText
 * A text element whose fill is a CSS gradient (base color + a white "shine"),
 * clipped to the glyphs (background-clip: text, transparent fill). framer-motion
 * continuously animates the gradient's background-position so the shine sweeps
 * across the text from left to right, looping forever.
 *
 * Props:
 *  - text        the string to render
 *  - baseColor   the resting text color            (default #64CEFB)
 *  - shineColor  the moving highlight color         (default #ffffff)
 *  - speed       seconds for one full sweep         (default 3)
 *  - spread      gradient angle in degrees          (default 100)
 *  - className   optional extra classes
 *  - as          element/tag to render ("span"/"h1"/...) default "span"
 */
export default function ShinyText({
  text,
  baseColor = "#64CEFB",
  shineColor = "#ffffff",
  speed = 3,
  spread = 100,
  className = "",
  as = "span",
}) {
  const MotionTag = motion[as] || motion.span;

  // base ─ base ─ SHINE ─ base ─ base, symmetric so the loop is seamless.
  const gradient = `linear-gradient(${spread}deg, ${baseColor} 0%, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%, ${baseColor} 100%)`;

  return (
    <MotionTag
      className={`shiny-text ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}
      // sweep left -> right, continuously
      initial={{ backgroundPosition: "200% 50%" }}
      animate={{ backgroundPosition: "-200% 50%" }}
      transition={{
        duration: speed,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {text}
    </MotionTag>
  );
}
