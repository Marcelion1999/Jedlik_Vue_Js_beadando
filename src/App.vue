<template>
  <div id="app">
    <p>
      Linkek: <a href="veetel.txt" download>veetel.txt   </a>
      <a href="Expedicio_feladat_fel.pdf" target="_blank">Feladat   </a>
      <a href="Expedicio_feladat_jav.pdf" target="_blank">Javítási  </a>
    </p>
    <txt-olvaso v-on:load="forras = $event" title="Kérem töltse fel a forrás (veetel.txt) állományt!" />
    <div id="megoldas" v-show="mutat">
       <p>1. feladat:<br>Az adatok beolvasása</p>
      <p>2. feladat:<br>Az első üzenetet: {{Első}} rögzítette, míg az utolsót : {{Utolsó}}</p>
      <p>3. feladat:</p>
       <ul>
        <li v-for="i in Farkas" :key="i">
           Nap: {{i.Nap_sorszam}}, RádióAmatőr: {{i.Radioamator}}
        </li>
      </ul>
      <p>4. feladat:</p>
      <ul>
        <li v-for="(y, index) in Statisztika" :key="y">
           Nap: {{index+1}}, Darabszám: {{y}}
        </li>
      </ul>
      <p>5. feladat:</p>
      <ul>
        <li v-for="(y, index) in adaas" :key="y">
           Nap: {{index+1}}, Üzenet: {{y}}
        </li>
      </ul>
    <p>6. feladat: fügvény megírása</p>
    <p>7. feladat:</p>
    <input type="text" v-model="DayText" placeholder="Nap"/>
    <input type="text" v-model="RadioText" placeholder="Rádióamatőr"/>
    <p>{{Farkasok}}</p>
        </div>
   <p v-show="mutat"><b>naplo.txt fájl:</b></p>
      <span v-for="(t, index) in forras.split('\n')" :key="index">{{t.trim()}}<br></span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TxtOlvaso from "./components/TxtOlvaso.vue";
import Vétel from "./vetel";
import { stringify } from "querystring";

@Component({ components: { TxtOlvaso } })
export default class App extends Vue {
  private forras: string = "";
  private mutat: boolean = false;
  private DayText: string = "";
  private RadioText: string = "";

  //fs: require("fs");
  private fs: TxtOlvaso = new TxtOlvaso();
  private lista: Vétel[] = [];
  //let Adat: new Vétel();

  @Watch("forras", { immediate: true, deep: true })
  haForrásVáltozik(val: string, oldVal: string) {
    if (val != "") {
      this.Feldolgoz();
    }
  }

  private Feldolgoz(): void {
    try {
      let aktDátum: string = "";
      let iforras: string[] = this.forras.split("\n");
      for (let i: number = 0; i < iforras.length - 1; i += 2) {
        this.lista.push(new Vétel(iforras[i].split(" "), iforras[i + 1]));
      }
      this.mutat = true;
    } catch (error) {
      this.mutat = false;
      this.forras = "";
      window.alert("Hibás forrás!");
    }
  }

  // 2. feladat

  private get Első(): string {
    if (this.lista.length !== 0) {
      return this.lista[0].Radioamator.toString();
    } else {
      return "";
    }
  }
  private get Utolsó(): string {
    if (this.lista.length !== 0) {
      return this.lista[this.lista.length - 1].Radioamator.toString();
    } else {
      return "";
    }
  }

  // 3. feladat

  private get Farkas(): Vétel[] {
    let vissza: Vétel[] = [];
    this.lista.forEach(i => {
      if (i.VanEFarkas()) {
        vissza.push(i);
      }
    });
    return vissza;
  }

  //4. feladat:
  private get Statisztika(): number[] {
    let vissza: number[] = [];
    if (this.lista.length !== 0) {
      let max: number = 0;
      this.lista.forEach(i => {
        if (i.Nap_sorszam > max) {
          max = i.Nap_sorszam;
        }
      });

      for (let i: number = 0; i < max; i++) {
        vissza.push(0);
      }

      this.lista.forEach(i => {
        vissza[i.Nap_sorszam - 1]++;
      });
    }
    return vissza;
  }

  //5. feladat:
  private get adaas(): string[] {
    let vissza: string[] = [];
    if (this.lista.length !== 0) {
      let max: number = 0;
      this.lista.forEach(i => {
        if (i.Nap_sorszam > max) {
          max = i.Nap_sorszam;
        }
      });

      for (let i: number = 0; i < max; i++) {
        vissza.push("");
      }

      this.lista.forEach(i => {
        if (vissza[i.Nap_sorszam - 1] === "") {
          vissza[i.Nap_sorszam - 1] = i.Uzenet;
        } else {
          for (let y: number = 0; y < i.Uzenet.length - 1; y++) {
            if (vissza[i.Nap_sorszam - 1][y] === "#") {
              vissza[i.Nap_sorszam - 1] =
                vissza[i.Nap_sorszam - 1].substring(0, y) +
                i.Uzenet[y] +
                vissza[i.Nap_sorszam - 1].substring(y + 1);
            }
          }
        }
      });
    }
    return vissza;
  }

  // 6. feladat

  private Szame(szo: string): boolean {
    let valasz: boolean = true;
    for (let i: number = 0; i < szo.length - 1; i++) {
      if (szo[i] < "0" || szo[i] > "9") {
        valasz = false;
      }
    }
    return valasz;
  }

  // 7. feladat

  private get Farkasok(): string {
    let vissza: string = "Nincs ilyen feljegyzés";
    this.lista.forEach(i => {
      if (
        i.Radioamator == parseInt(this.RadioText) &&
        i.Nap_sorszam == parseInt(this.DayText)
      ) {
        let farkas = i.Uzenet.split(" ")[0].split("/");
        if (farkas.length < 2) {
          vissza = "Nincs  információ";
        } else if (this.Szame(farkas[0]) && this.Szame(farkas[1])) {
          vissza =
            (parseInt(farkas[0]) + parseInt(farkas[1])).toString() +
            " számú fakras volt!";
        } else {
          vissza = "Nincs  információ";
        }
      }
    });
    return vissza;
  }
}
</script>

<style>
#app {
  font-family: Courier;
}
#megoldas {
  background-color: lightgrey;
}
a {
  text-decoration: none;
}
</style>
