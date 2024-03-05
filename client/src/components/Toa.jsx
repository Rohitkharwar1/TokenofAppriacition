import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import Sidebar from "../components/Sidebar";
import { generateTokenOfAppreciation } from "../pdfUtils";
import axios from "axios";

const Toa = ({ onLogout }) => {
  const divRefs = useRef([]);
  const [toaList, setToaList] = useState([]);
  const [toaListForMe, settoaListForMe] = useState([]);

  const handleDownload = async (index) => {
    console.log("Downloading...", index);
    const div = divRefs.current[index];
    if (!div) {
      console.error("Div element not found");
      return;
    }

    // Generate token of appreciation
    const recipientName = "John Doe"; // You can make this dynamic
    try {
      const pdfBytes = await generateTokenOfAppreciation(recipientName);
      console.log("PDF bytes:", pdfBytes); // Log the PDF bytes to check if they are generated correctly
      if (!pdfBytes) {
        console.error("PDF bytes not generated");
        return;
      }

      // Create a Blob from the PDF bytes
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create a temporary link element and trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Token_of_Appreciation.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const getLocalStore = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  };

  useEffect(() => {
    const fetchToaAllotedByU = async () => {
      const userDetail = getLocalStore("user");
      await axios
        .get("/api/token/allotedbyu", {
          headers: {
            Authorization: `Bearer ${userDetail.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setToaList(res.data.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    };
    const fetchToaAllotedForMe = async () => {
      const userDetail = getLocalStore("user");
      await axios
        .get("/api/token/", {
          headers: {
            Authorization: `Bearer ${userDetail.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          settoaListForMe(res.data.data);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    };

    fetchToaAllotedByU();
    fetchToaAllotedForMe();
  }, []);

  const downloadToken = (id) => {
    const div = divRefs.current[id];
    html2canvas(div).then((canvas) => {
      const link = document.createElement("a");
      link.download = `token_${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <>
      <div className=" flex flex-row w-screen">
        <Sidebar onLogout={onLogout} />
        <div className="bg-slate-300/30 flex-[3] h-screen">
          <div className="flex flex-col w-full items-center justify-center">
            <p>Alloyted by me</p>
            <div className=" gap-4 mt-16 text-lg font-medium p-4 items-center justify-center border-[4px] bg-slate-300/30">
              {toaList &&
                toaList.map((item, index) => (
                  <div
                    key={index}
                    className=" w-full flex  items-center justify-center flex-row gap-3  "
                  >
                    <div
                      className=" w-full flex  items-center justify-center flex-row "
                      ref={(el) => (divRefs.current[index] = el)}
                    >
                      {/* {JSON.stringify(item)} */}
                      <div className="bg-red-600  my-3 rounded-md p-4 flex justify-center items-center">
                        <div className="ticket w-[600px] h-100 mx-4">
                          <div className="check border-2 border-red-600 rounded-lg bg-white p-4">
                            <div className="big">
                              <p className="text-base font-bold">You got</p>
                              <p className="text-red-600 text-lg font-bold">
                                Token of Appreciation
                              </p>
                            </div>
                            <div className="number text-4xl font-bold text-red-600">
                              #{item.points} <p className="text-sm">points</p>
                            </div>
                            <div className="number text-4xl font-bold text-red-600">
                              {item.reason}{" "}
                              <p className="text-base pt-2">Reason</p>
                            </div>
                            <div className="info text-base flex justify-between mt-4">
                              <section className="mb-2 w-1/3">
                                <div className="title font-bold text-red-600 text-center">
                                  Issued By
                                </div>
                                <div className="text-center">
                                  {item.sender.name}
                                </div>
                              </section>
                              <section className="mb-2 w-1/3">
                                <div className="title font-bold text-red-600 text-center">
                                  Issued to
                                </div>
                                <div className="text-center">
                                  {item.recipient.name}
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white p-2 rounded-sm w-[100px] "
                      onClick={() => {
                        downloadToken(index);
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
            </div>
            <p>Alloted to me</p>
            <div className=" gap-4 mt-16 text-lg font-medium p-4 items-center justify-center border-[4px] bg-slate-300/30">
              {toaListForMe &&
                toaListForMe.map((item, index) => (
                  <div
                    key={index}
                    className=" w-full flex  items-center justify-center flex-row gap-3  "
                  >
                    <div
                      className=" w-full flex  items-center justify-center flex-row "
                      ref={(el) => (divRefs.current[index] = el)}
                    >
                      {/* {JSON.stringify(item)} */}
                      <div className="bg-red-600  my-3 rounded-md p-4 flex justify-center items-center">
                        <div className="ticket w-[600px] h-100 mx-4">
                          <div className="check border-2 border-red-600 rounded-lg bg-white p-4">
                            <div className="big">
                              <p className="text-base font-bold">You got</p>
                              <p className="text-red-600 text-lg font-bold">
                                Token of Appreciation
                              </p>
                            </div>
                            <div className="number text-4xl font-bold text-red-600">
                              #{item.points} <p className="text-sm">points</p>
                            </div>
                            <div className="number text-4xl font-bold text-red-600">
                              {item.reason}{" "}
                              <p className="text-base pt-2">Reason</p>
                            </div>
                            <div className="info text-base flex justify-between mt-4">
                              <section className="mb-2 w-1/3">
                                <div className="title font-bold text-red-600 text-center">
                                  Issued By
                                </div>
                                <div className="text-center">
                                  {item.sender.name}
                                </div>
                              </section>
                              <section className="mb-2 w-1/3">
                                <div className="title font-bold text-red-600 text-center">
                                  Issued to
                                </div>
                                <div className="text-center">
                                  {item.recipient.name}
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bg-blue-600 text-white p-2 rounded-sm w-[100px] "
                      onClick={() => {
                        downloadToken(index);
                      }}
                    >
                      Download
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toa;
