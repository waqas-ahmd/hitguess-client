export const generateCode = (num) => {
  const characters =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let code = [];
  for (let i = 0; i < num; i++) {
    code.push(characters[Math.floor(Math.random() * characters.length)]);
  }
  return code.join("");
};

export const ERRORS = ["Success", "InValid Code", "Room is Busy"];
