export default class Vétel {
    public Nap_sorszam: number;
    public Radioamator: number;
    public Uzenet: string;

    public constructor(a: string[], b: string) {
        this.Nap_sorszam = parseInt(a[0]);
        this.Radioamator = parseInt(a[1]);
        this.Uzenet = b;
    }


    public get Megfigyeltegyedek(): number {
        let m: string[] = this.Uzenet.split(' ');
        let n: string[] = m[1].split('/');
        if (m.length != 2) {
            return 0;
        }
        else {
            let megoldas: number = parseInt(m[1] + m[2]);
            return megoldas;
        }

    }

    public VanEFarkas(): boolean {
        let i: boolean = this.Uzenet.search("farkas") > 0;
        return i;
    }

}

