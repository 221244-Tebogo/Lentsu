// components/ui/linear-gradient.tsx
import React from "react";
import { LinearGradient as ExpoLinearGradient, LinearGradientProps } from "expo-linear-gradient";


type Props = LinearGradientProps & { className?: string };

export const LinearGradient = React.forwardRef<any, Props>(({ className, ...props }, ref) => {
  return <ExpoLinearGradient ref={ref} {...props} />;
});
LinearGradient.displayName = "LinearGradient";
