import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const QRCodeComponent = ({ data }) => {
  const qrRef = useRef(null);
  const qrCode = useRef(null);

  useEffect(() => {
    if (!qrCode.current) {
      // Create QR code only once
      qrCode.current = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data: data,
        image:"https://res.cloudinary.com/dzberldw0/image/upload/v1740407822/Resmic_Black_transparent_oabphm.png",
        dotsOptions: {
          color: "#000000",
          type: "dots",
        },
        backgroundOptions: {
          color: "#ffffff",
        },
      });

      if (qrRef.current) {
        qrCode.current.append(qrRef.current);
      }
    } else {
      // Update QR code instead of creating a new one
      qrCode.current.update({ data: data });
    }
  }, [data]); // Only updates when `data` changes

  return <div ref={qrRef}></div>;
};

export default QRCodeComponent;


// import React, { useEffect, useRef } from "react";
// import QRCodeStyling  from "qr-code-styling";

// const QRCodeComponent = ({ data }) => {
//   const qrRef = useRef(null);
//   const qrCode = useRef(null);

//   useEffect(() => {
//     qrCode.current = new QRCodeStyling({
//       width: 200,
//       height: 200,
//       type: "svg",
//       data: data,
//     //   image: "", // Optional: You can add a logo here
//     //   shape: "circle", // Optional: You can add
//       dotsOptions: {
//         color: "#000000",
//         // type: "classy-rounded",
//         // type: "extra-rounded",
//         type: "dots",
//       },
//       backgroundOptions: {
//         color: "#ffffff",
//       },
//     });

//     if (qrRef.current) {
//       qrCode.current.append(qrRef.current);
//     }
//   }, [data]);

//   return <div ref={qrRef}></div>;
// };

// export default QRCodeComponent;
