
export class TemplateDto {
    constructor(
        public id: number,
        public name: string,
        public fileName: string,
        public imageUrl: string,
        public extention: string,
        public uploadedAt: string
    ) { }
}