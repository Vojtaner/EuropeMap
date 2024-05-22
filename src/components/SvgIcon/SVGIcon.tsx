import { SVGProps } from "react";

export const SvgIcon = ({
  width,
  height,
  size,
  viewBox,
  children,
  ...props
}: SVGIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox={viewBox}
      {...props}
    >
      {children}
    </svg>
  );
};

export interface SVGIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}
