import React from 'react';
import './SmoothTextReveal.css';

export interface SequentialDelayOptions {
  initialDelay?: number;
  charSpeed?: number;
  fadeDuration?: number;
  pauseBetween?: number;
}

/**
 * Calculates strictly non-overlapping sequential start delays for an array of text strings.
 * Guarantees that each string waits for the preceding string to completely finish its
 * letter-by-letter typing and fade animation before writing the next one.
 */
export function calculateSequentialDelays(
  texts: string[],
  options: SequentialDelayOptions = {}
): number[] {
  const {
    initialDelay = 0.08,
    charSpeed = 0.015,
    fadeDuration = 0.18,
    pauseBetween = 0.04,
  } = options;

  const delays: number[] = [];
  let currentStart = initialDelay;

  for (let i = 0; i < texts.length; i++) {
    delays.push(Number(currentStart.toFixed(3)));
    const textLength = texts[i].length;
    const typingDuration = textLength * charSpeed;
    const totalSentenceDuration = typingDuration + fadeDuration;
    currentStart = currentStart + totalSentenceDuration + pauseBetween;
  }

  return delays;
}

interface SmoothTextRevealProps {
  text: string;
  baseDelay?: number;
  charSpeed?: number;
  animate?: boolean;
  className?: string;
}

export const SmoothTextReveal: React.FC<SmoothTextRevealProps> = ({
  text,
  baseDelay = 0.1,
  charSpeed = 0.016,
  animate = true,
  className = '',
}) => {
  const words = text.split(' ');
  let runningCharOffset = 0;

  return (
    <span className={`smooth-text-reveal ${className}`}>
      {/* Screen reader and programmatic text representation */}
      <span className="sr-only">{text}</span>

      {/* Visual character-by-character smooth staggered reveal */}
      <span aria-hidden="true" className="reveal-visual-line">
        {words.map((word, wordIndex) => {
          const chars = word.split('');
          const currentWordStartOffset = runningCharOffset;
          runningCharOffset += chars.length + 1; // Count characters plus space

          return (
            <React.Fragment key={wordIndex}>
              <span className="reveal-word">
                {chars.map((char, charIndex) => {
                  const delay = (
                    baseDelay +
                    (currentWordStartOffset + charIndex) * charSpeed
                  ).toFixed(3);

                  return (
                    <span
                      key={charIndex}
                      className={`reveal-char ${animate ? 'is-animating' : 'is-static'}`}
                      style={
                        animate
                          ? ({
                              '--char-delay': `${delay}s`,
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 ? ' ' : null}
            </React.Fragment>
          );
        })}
      </span>
    </span>
  );
};
