exports.command = "hello [name]";
exports.desc = "Say Hello";
exports.handler = function(argv) {
  console.log(`hello ${argv.name}`);
};
