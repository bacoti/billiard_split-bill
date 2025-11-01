import React from 'react';

/**
 * Smooth Scroll Animation Container
 */
export const ScrollReveal = ({ children, delay = 0, direction = 'up' }) => {
    const directionClasses = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8'
    };

    return (
        <div
            className={`opacity-0 transition-all duration-700 ease-out ${directionClasses[direction]}`}
            style={{
                animation: `fadeInUp 0.7s ease-out ${delay}ms forwards`,
            }}
        >
            {children}
        </div>
    );
};

/**
 * Hover Scale Animation
 */
export const HoverScale = ({ children, scale = 1.05 }) => {
    return (
        <div
            className="transition-transform duration-300 ease-out"
            style={{
                '&:hover': {
                    transform: `scale(${scale})`
                }
            }}
        >
            {children}
        </div>
    );
};

/**
 * Floating Animation
 */
export const FloatingCard = ({ children, delay = 0 }) => {
    return (
        <div
            className="transition-transform duration-500"
            style={{
                animation: `float 6s ease-in-out ${delay}s infinite`,
            }}
        >
            {children}
        </div>
    );
};

/**
 * Pulse Animation
 */
export const PulseAnimation = ({ children, intensity = 'normal' }) => {
    const intensityClasses = {
        subtle: 'animate-pulse',
        normal: 'animate-pulse',
        strong: 'animate-pulse'
    };

    return (
        <div className={intensityClasses[intensity]}>
            {children}
        </div>
    );
};

/**
 * Gradient Animation
 */
export const GradientAnimation = ({ children }) => {
    return (
        <div
            className="transition-all duration-500"
            style={{
                animation: `gradient 15s ease infinite`,
                backgroundSize: '200% 200%'
            }}
        >
            {children}
        </div>
    );
};

/**
 * Counter Animation - Untuk menghitung dari 0 ke nilai tertentu
 */
export const CounterAnimation = ({ end = 100, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        let current = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end, duration]);

    return (
        <span>
            {prefix}
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
};

/**
 * Shimmer Loading Animation
 */
export const ShimmerLoader = ({ width = 'w-full', height = 'h-4' }) => {
    return (
        <div className={`${width} ${height} rounded-lg bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-shimmer`}></div>
    );
};

/**
 * Staggered Animation Container
 */
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => {
    return (
        <div>
            {React.Children.map(children, (child, index) => (
                <div
                    key={index}
                    style={{
                        animation: `fadeInUp 0.6s ease-out ${index * staggerDelay}s forwards`,
                        opacity: 0,
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

/**
 * Bounce Animation
 */
export const BounceAnimation = ({ children }) => {
    return (
        <div className="animate-bounce">
            {children}
        </div>
    );
};

/**
 * Slide In Animation
 */
export const SlideInAnimation = ({ children, direction = 'left', duration = 0.5 }) => {
    const directionClasses = {
        left: 'slide-in-from-left',
        right: 'slide-in-from-right',
        top: 'slide-in-from-top',
        bottom: 'slide-in-from-bottom'
    };

    return (
        <div
            className={`animate-in ${directionClasses[direction]} duration-${Math.floor(duration * 1000)}`}
        >
            {children}
        </div>
    );
};

/**
 * Tooltip dengan Animation
 */
export const AnimatedTooltip = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: '-top-12 left-1/2 -translate-x-1/2',
        bottom: 'top-12 left-1/2 -translate-x-1/2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {isVisible && (
                <div
                    className={`absolute ${positionClasses[position]} bg-slate-900 dark:bg-slate-950 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50 animate-in fade-in duration-200`}
                >
                    {content}
                    {/* Arrow */}
                    <div className="absolute w-2 h-2 bg-slate-900 dark:bg-slate-950 transform rotate-45" style={{
                        [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
                        [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : position === 'left' ? 'right' : 'left']: '-4px',
                        [position === 'top' || position === 'bottom' ? 'transform' : '']: position === 'top' || position === 'bottom' ? 'translateX(-50%)' : ''
                    }}></div>
                </div>
            )}
        </div>
    );
};

/**
 * Parallax Scroll Animation
 */
export const ParallaxScroll = ({ children, speed = 0.5 }) => {
    const [offset, setOffset] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY * speed);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);

    return (
        <div style={{ transform: `translateY(${offset}px)` }} className="transition-transform duration-100">
            {children}
        </div>
    );
};

export default {
    ScrollReveal,
    HoverScale,
    FloatingCard,
    PulseAnimation,
    GradientAnimation,
    CounterAnimation,
    ShimmerLoader,
    StaggerContainer,
    BounceAnimation,
    SlideInAnimation,
    AnimatedTooltip,
    ParallaxScroll
};
