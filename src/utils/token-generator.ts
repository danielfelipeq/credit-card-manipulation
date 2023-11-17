export class TokenGenerator {
    public generate(): string {
        let token = "";

        for (let i = 0; i < 32; i++) {
            let randomIndex = Math.floor(Math.random() * 62);
            token += this.characters[randomIndex];
        }

        return token;
    }

    private readonly characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
}
