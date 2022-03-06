module.exports = {
    name: "permute",
    description: "Command description",
    async execute(message, args) {
        let permute = function(length, string) {
            if (length === 0) {
                console.log(string);
            }
            else {
                for (let i = 0; i <= length; i++) {
                    permute(length-1, string);
                    swap(string, length % 2 == 0 ? i : 0, length);
                }
            }
        };

        let swap = function(chars, i, j) {
            let saved = chars[i];
            chars[i] = chars[j];
            chars[j] = saved;
        };

        let input = [
            '🟦', '🟥', '🟩', '🟪', '🟧'
        ];

        let count = args[0] ? args[0] : 5;

        console.log("Start permuting!");

        permute(count, input);

        console.log("Ended permuting!");
    }
};