import { Resend } from "resend";
import fs from "fs";

const resend = new Resend("re_a6gtE8Cg_JxwuvjBrUkZN3YcBQSbPuXmi");

var html = `<body style="background: #dd3f3e; font-family: 'Montserrat', sans-serif; margin: 0; padding: 0; height: 100%; display: flex; align-items: center; justify-content: center; ">
  <div class="ticket" style="width: 100%; max-width: 600px; margin: 20px auto; text-align: center ;">
 
    <div class="check" style="border: 2px solid #ef5658; border-radius: 10px; margin-bottom: 20px; background: #fff; padding: 40px;">
      <div class="big" style=""><p style='font-size: 20px; font-weight: bold;'>You got</p><p  style="color: #ef5658; ont-size: 28px; font-weight: bold;"> Token of Appriciation</p></div>
      <div class="number" style="font-size: 50px; font-weight: bold; color: #ef5658;">#@@points@@ <p  style="font-size:14px">points</p></div>
      <div class="number" style="font-size: 50px; font-weight: bold; color: #ef5658;">@@reason@@ <p  style="font-size:16px">points</p></div>
      <div class="info" style="font-size: 14px; text-align: left; display:flex; justify-content:space-between; margin-top:20px; width:100%">
        <section style="margin-bottom: 10px; width:150px">
          <div class="title" style="font-weight: bold; color: #ef5658; text-align:center">Date</div>
          <div  style='text-align:center'>@@date@@</div>
        </section>
        <section style="margin-bottom: 10px;width:150px">
          <div class="title" style="font-weight: bold; color: #ef5658; text-align:center">Issued By</div>
          <div  style='text-align:center'>@@issuedby@@</div>
        </section>
        <section style="margin-bottom: 10px;width:150px">
          <div class="title" style="font-weight: bold; color: #ef5658; text-align:center">Issued to</div>
          <div style='text-align:center'>@@issuedto@@</div>
        </section>
      </div>
    </div>
  </div>
</body>`;

const updateHTML = (points, issuedby, issuedto, reason) => {
  const d = new Date();
  const formattedDate = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  return html
    .replace("@@date@@", formattedDate)
    .replace("@@issuedto@@", issuedto)
    .replace("@@issuedby@@", issuedby)
    .replace("@@points@@", points)
    .replace("@@reason@@", reason);
};

export const sendEmail = (email, Rname, Sname, reason) => {
  resend.emails.send({
    from: "480ps <onboarding@resend.dev>",
    to: "rohitkharwar000@gmail.com",
    subject: "Allot TOA",
    html: updateHTML(10, Rname, Sname, reason),
  });
};
