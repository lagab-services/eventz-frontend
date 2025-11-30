import React from "react";
import { QRCodeSVG } from "qrcode.react";
import type { HTMLAttributes } from "react";

export type QRCodeProps = HTMLAttributes<HTMLDivElement> & {
    data: string;
    foreground?: string;
    background?: string;
    robustness?: "L" | "M" | "Q" | "H";
};

export const QRCode  = ({
                                                  data,
                                                  foreground = "#000000",
                                                  background = "#ffffff",
                                                  robustness = "M",
                                                  style,
                                                  className,
                                                  ...props
                                              }: QRCodeProps) => {
    return (
        <div
            className={className}
            style={{ display: "inline-block", ...style }}
            {...props}
        >
            <QRCodeSVG
                value={data}
                fgColor={foreground}
                bgColor={background}
                level={robustness}
            />
        </div>
    );
};
