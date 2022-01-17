const fs = require("fs");
const readline = require("readline");

/**
 * log the action to activity_logs.txt file
 * @param {*} Object as shown 
 * sender: the current ID 
 * action: action to be performed
 * data
 * date: performed date
 */

exports.log_action = ({ sender_id, action, data, date }) => {
  let content = `${date}|${sender_id}|${action}|${
    data ? data.toString() : " "
  }`;
  content += "\n";

  const oldData = fs.readFileSync("activity_logs.txt");
  const fd = fs.openSync("activity_logs.txt", "w+");
  const insert = Buffer.from(content);
  fs.writeSync(fd, insert, 0, insert.length, 0);
  fs.writeSync(fd, oldData, 0, oldData.length, insert.length);
  fs.close(fd, (err) => {
    if (err) throw err;
  });
};

/**
 * pass in {all} to get all log or {limit: value} to limit the result array
 */
const DEFAULT_VALUE = 10;
exports.view_action = async (option) => {
  var all = option.all;
  var limit = option.limit || DEFAULT_VALUE;

  const fileStream = fs.createReadStream("activity_logs.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.w

  let count = 0, res = [];
  for await (const line of rl) {
    if (!all && count > limit){
      return res;
    }
    count++;
    res.push(line);
  }
  return res;
};

