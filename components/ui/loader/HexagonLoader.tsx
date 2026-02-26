import { twMerge } from "tailwind-merge";

interface HexagonLoaderProps {
    className?: string;
}

const HEX_TRIANGLES = [
    { id: 1, points: "50,50 50,0 93.3,25", color: "#fde4ae" },
    { id: 2, points: "50,50 93.3,25 93.3,75", color: "#ffe2b4" },
    { id: 3, points: "50,50 93.3,75 50,100", color: "#ffa006" },
    { id: 4, points: "50,50 50,100 6.7,75", color: "#fea40a" },
    { id: 5, points: "50,50 6.7,75 6.7,25", color: "#ffc268" },
    { id: 6, points: "50,50 6.7,25 50,0", color: "#f7e4b2" },
];

const OUTER_HEXAGON = "50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25";

export const HexagonLoader = ({ className }: HexagonLoaderProps) => {
    return (
        <div className={twMerge("relative flex items-center justify-center w-12 h-12", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {HEX_TRIANGLES.map((triangle, index) => (
                    <polygon
                        key={triangle.id}
                        points={triangle.points}
                        fill={triangle.color}
                        className="animate-hex-fill origin-[50px_50px]"
                        style={{
                            animationDelay: `${index * 0.15}s`,
                        }}
                    />
                ))}

                <polygon
                    points={OUTER_HEXAGON}
                    fill="none"
                    stroke="#ffa006"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    className="opacity-50"
                />
            </svg>
        </div>
    );
};
