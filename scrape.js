const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://denisa-iordache.github.io/Nomenclator_2023_2024/');

  const data = await page.evaluate(() => {
    let tableSections = document.querySelectorAll('table');
    const tableData = [];
    tableSections=Array.from(tableSections).slice(0, -27);

    // Start from the second table (index 1)
    tableSections.forEach((table, index) => {
      if (index === 0) return; // Skip the first table

      const rows = Array.from(table.querySelectorAll('tbody tr'));

      let universitate = '';

      // Take the university name from the first row of the current table
      if (rows.length > 0) {
        universitate = rows[0].innerText.trim();
      }

      // Variables to keep track of current merged cell values
      let currentNumber = '';
      let currentFaculty = '';
      let currentDomain = '';
      if(rows[0].innerText.trim()!=="13. INSTITUTUL DE ADMINISTRARE A AFACERILOR DIN MUNICIPIUL BUCUREŞTI - Învăţământ\n\nuniversitar - ciclul II"){
      // Start from the third row to skip the first two rows of each table
      rows.slice(2).forEach(row => {
        const cells = Array.from(row.cells);
        let rowData = {};

        // Verifică dacă linia este goală
        const isEmptyRow = cells.every(cell => cell.innerText.trim() === '');

        if (isEmptyRow) {
          return; // Sare peste liniile goale
        }

        const firstCellEmpty = cells[0] && cells[0].innerText.trim() === '';
        const lastCellEmpty = cells[cells.length - 1] && cells[cells.length - 1].innerText.trim() === '';

        if(!firstCellEmpty && !lastCellEmpty){
            if (cells.length === 8) {
                currentNumber = cells[0].innerText.trim();
                currentFaculty = cells[1].innerText.trim();
                currentDomain = cells[2].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[3].innerText.trim(),
                  acreditare: cells[4].innerText.trim(),
                  formaInvatamant: cells[5].innerText.trim(),
                  credite: cells[6].innerText.trim(),
                  numarStudenti: cells[7].innerText.trim(),
                };
              } else if (cells.length === 7) {
                currentFaculty = cells[0].innerText.trim();
                currentDomain = cells[1].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[2].innerText.trim(),
                  acreditare: cells[3].innerText.trim(),
                  formaInvatamant: cells[4].innerText.trim(),
                  credite: cells[5].innerText.trim(),
                  numarStudenti: cells[6].innerText.trim(),
                };
              } else if (cells.length === 6) {
                currentDomain = cells[0].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[1].innerText.trim(),
                  acreditare: cells[2].innerText.trim(),
                  formaInvatamant: cells[3].innerText.trim(),
                  credite: cells[4].innerText.trim(),
                  numarStudenti: cells[5].innerText.trim(),
                };
              } else if (cells.length === 5) {
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[0].innerText.trim(),
                  acreditare: cells[1].innerText.trim(),
                  formaInvatamant: cells[2].innerText.trim(),
                  credite: cells[3].innerText.trim(),
                  numarStudenti: cells[4].innerText.trim(),
                };
              }
        }else if(firstCellEmpty && !lastCellEmpty){
            if (cells.length === 9) {
                currentNumber = cells[1].innerText.trim();
                currentFaculty = cells[2].innerText.trim();
                currentDomain = cells[3].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[4].innerText.trim(),
                  acreditare: cells[5].innerText.trim(),
                  formaInvatamant: cells[6].innerText.trim(),
                  credite: cells[7].innerText.trim(),
                  numarStudenti: cells[8].innerText.trim(),
                };
              } else if (cells.length === 8) {
                currentFaculty = cells[1].innerText.trim();
                currentDomain = cells[2].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[3].innerText.trim(),
                  acreditare: cells[4].innerText.trim(),
                  formaInvatamant: cells[5].innerText.trim(),
                  credite: cells[6].innerText.trim(),
                  numarStudenti: cells[7].innerText.trim(),
                };
              } else if (cells.length === 7) {
                currentDomain = cells[1].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[2].innerText.trim(),
                  acreditare: cells[3].innerText.trim(),
                  formaInvatamant: cells[4].innerText.trim(),
                  credite: cells[5].innerText.trim(),
                  numarStudenti: cells[6].innerText.trim(),
                };
              } else if (cells.length === 6) {
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[1].innerText.trim(),
                  acreditare: cells[2].innerText.trim(),
                  formaInvatamant: cells[3].innerText.trim(),
                  credite: cells[4].innerText.trim(),
                  numarStudenti: cells[5].innerText.trim(),
                };
              }
        }else if(!firstCellEmpty && lastCellEmpty){
            if (cells.length === 9) {
                currentNumber = cells[0].innerText.trim();
                currentFaculty = cells[1].innerText.trim();
                currentDomain = cells[2].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[3].innerText.trim(),
                  acreditare: cells[4].innerText.trim(),
                  formaInvatamant: cells[5].innerText.trim(),
                  credite: cells[6].innerText.trim(),
                  numarStudenti: cells[7].innerText.trim(),
                };
              } else if (cells.length === 8) {
                currentFaculty = cells[0].innerText.trim();
                currentDomain = cells[1].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[2].innerText.trim(),
                  acreditare: cells[3].innerText.trim(),
                  formaInvatamant: cells[4].innerText.trim(),
                  credite: cells[5].innerText.trim(),
                  numarStudenti: cells[6].innerText.trim(),
                };
              } else if (cells.length === 7) {
                currentDomain = cells[0].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[1].innerText.trim(),
                  acreditare: cells[2].innerText.trim(),
                  formaInvatamant: cells[3].innerText.trim(),
                  credite: cells[4].innerText.trim(),
                  numarStudenti: cells[5].innerText.trim(),
                };
              } else if (cells.length === 6) {
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[0].innerText.trim(),
                  acreditare: cells[1].innerText.trim(),
                  formaInvatamant: cells[2].innerText.trim(),
                  credite: cells[3].innerText.trim(),
                  numarStudenti: cells[4].innerText.trim(),
                };
              }
        }else if(firstCellEmpty && lastCellEmpty){
            if (cells.length === 10) {
                currentNumber = cells[1].innerText.trim();
                currentFaculty = cells[2].innerText.trim();
                currentDomain = cells[3].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[4].innerText.trim(),
                  acreditare: cells[5].innerText.trim(),
                  formaInvatamant: cells[6].innerText.trim(),
                  credite: cells[7].innerText.trim(),
                  numarStudenti: cells[8].innerText.trim(),
                };
              } else if (cells.length === 9) {
                currentFaculty = cells[1].innerText.trim();
                currentDomain = cells[2].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[3].innerText.trim(),
                  acreditare: cells[4].innerText.trim(),
                  formaInvatamant: cells[5].innerText.trim(),
                  credite: cells[6].innerText.trim(),
                  numarStudenti: cells[7].innerText.trim(),
                };
              } else if (cells.length === 8) {
                currentDomain = cells[1].innerText.trim();
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[2].innerText.trim(),
                  acreditare: cells[3].innerText.trim(),
                  formaInvatamant: cells[4].innerText.trim(),
                  credite: cells[5].innerText.trim(),
                  numarStudenti: cells[6].innerText.trim(),
                };
              } else if (cells.length === 7) {
                rowData = {
                  universitate,
                  numar: currentNumber,
                  facultate: currentFaculty,
                  domeniu: currentDomain,
                  specializare: cells[1].innerText.trim(),
                  acreditare: cells[2].innerText.trim(),
                  formaInvatamant: cells[3].innerText.trim(),
                  credite: cells[4].innerText.trim(),
                  numarStudenti: cells[5].innerText.trim(),
                };
              }
        }

        tableData.push(rowData);
      });
      }
    });

    return tableData;
  });

  const data1 = await page.evaluate(() => {
    const table = document.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const tableData = [];

    // Variabile pentru a reține valorile curente ale celulelor mergeuite
    let currentCodDFI = '';
    let currentDFI = '';
    let currentCodRSI = '';
    let currentRSI = '';
    let currentCodDSU = '';
    let currentDSU = '';
    let currentCodDL = '';
    let currentDL = '';

    // Începem de la al doilea rând pentru a omite primul rând
    rows.slice(1,51).forEach(row => {
        // Logica pentru liniile de la începutul tabelului
        const cells = Array.from(row.cells);
        let rowData = {};

        if (cells.length === 14) {
          currentCodDFI = cells[1].innerText.trim();
          currentDFI = cells[2].innerText.trim();
          currentCodRSI = cells[3].innerText.trim();
          currentRSI = cells[4].innerText.trim();
          currentCodDSU = cells[5].innerText.trim();
          currentDSU = cells[6].innerText.trim();
          currentCodDL = cells[7].innerText.trim();
          currentDL = cells[8].innerText.trim();
          rowData = {
            codDFI: currentCodDFI,
            DFI: currentDFI,
            codRSI: currentCodRSI,
            RSI: currentRSI,
            codDSU: currentCodDSU,
            DSU: currentDSU,
            codDL: currentCodDL,
            DL: currentDL,
            codS: cells[9] ? cells[9].innerText.trim() : '',
            specializare: cells[10] ? cells[10].innerText.trim() : '',
            credite: cells[11] ? cells[11].innerText.trim() : '',
            codISCED: cells[12] ? cells[12].innerText.trim() : '',
            domeniuISCED: cells[13] ? cells[13].innerText.trim() : ''
          };
        } else if (cells.length === 12) {
          currentCodRSI = cells[1].innerText.trim();
          currentRSI = cells[2].innerText.trim();
          currentCodDSU = cells[3].innerText.trim();
          currentDSU = cells[4].innerText.trim();
          currentCodDL = cells[5].innerText.trim();
          currentDL = cells[6].innerText.trim();
          rowData = {
            codDFI: currentCodDFI,
            DFI: currentDFI,
            codRSI: currentCodRSI,
            RSI: currentRSI,
            codDSU: currentCodDSU,
            DSU: currentDSU,
            codDL: currentCodDL,
            DL: currentDL,
            codS: cells[7] ? cells[7].innerText.trim() : '',
            specializare: cells[8] ? cells[8].innerText.trim() : '',
            credite: cells[9] ? cells[9].innerText.trim() : '',
            codISCED: cells[10] ? cells[10].innerText.trim() : '',
            domeniuISCED: cells[11] ? cells[11].innerText.trim() : ''
          };
        } else if (cells.length === 10) {
          currentCodDSU = cells[1].innerText.trim();
          currentDSU = cells[2].innerText.trim();
          currentCodDL = cells[3].innerText.trim();
          currentDL = cells[4].innerText.trim();
          rowData = {
            codDFI: currentCodDFI,
            DFI: currentDFI,
            codRSI: currentCodRSI,
            RSI: currentRSI,
            codDSU: currentCodDSU,
            DSU: currentDSU,
            codDL: currentCodDL,
            DL: currentDL,
            codS: cells[5] ? cells[5].innerText.trim() : '',
            specializare: cells[6] ? cells[6].innerText.trim() : '',
            credite: cells[7] ? cells[7].innerText.trim() : '',
            codISCED: cells[8] ? cells[8].innerText.trim() : '',
            domeniuISCED: cells[9] ? cells[9].innerText.trim() : ''
          };
        } else if (cells.length === 8) {
          currentCodDL = cells[1].innerText.trim();
          currentDL = cells[2].innerText.trim();
          rowData = {
            codDFI: currentCodDFI,
            DFI: currentDFI,
            codRSI: currentCodRSI,
            RSI: currentRSI,
            codDSU: currentCodDSU,
            DSU: currentDSU,
            codDL: currentCodDL,
            DL: currentDL,
            codS: cells[3] ? cells[3].innerText.trim() : '',
            specializare: cells[4] ? cells[4].innerText.trim() : '',
            credite: cells[5] ? cells[5].innerText.trim() : '',
            codISCED: cells[6] ? cells[6].innerText.trim() : '',
            domeniuISCED: cells[7] ? cells[7].innerText.trim() : ''
          };
        } else if (cells.length === 6) {
          rowData = {
            codDFI: currentCodDFI,
            DFI: currentDFI,
            codRSI: currentCodRSI,
            RSI: currentRSI,
            codDSU: currentCodDSU,
            DSU: currentDSU,
            codDL: currentCodDL,
            DL: currentDL,
            codS: cells[1] ? cells[1].innerText.trim() : '',
            specializare: cells[2] ? cells[2].innerText.trim() : '',
            credite: cells[3] ? cells[3].innerText.trim() : '',
            codISCED: cells[4] ? cells[4].innerText.trim() : '',
            domeniuISCED: cells[5] ? cells[5].innerText.trim() : ''
          };
        }
        tableData.push(rowData);
    });

    rows.slice(51).forEach(row => {
      // Logica pentru liniile de la începutul tabelului
      const cells = Array.from(row.cells);
      let rowData = {};

      if (cells.length === 14) {
        currentCodDFI = cells[0].innerText.trim();
        currentDFI = cells[1].innerText.trim();
        currentCodRSI = cells[2].innerText.trim();
        currentRSI = cells[3].innerText.trim();
        currentCodDSU = cells[4].innerText.trim();
        currentDSU = cells[5].innerText.trim();
        currentCodDL = cells[6].innerText.trim();
        currentDL = cells[7].innerText.trim();
        rowData = {
          codDFI: currentCodDFI,
          DFI: currentDFI,
          codRSI: currentCodRSI,
          RSI: currentRSI,
          codDSU: currentCodDSU,
          DSU: currentDSU,
          codDL: currentCodDL,
          DL: currentDL,
          codS: cells[8] ? cells[8].innerText.trim() : '',
          specializare: cells[9] ? cells[9].innerText.trim() : '',
          credite: cells[10] ? cells[10].innerText.trim() : '',
          codISCED: cells[11] ? cells[11].innerText.trim() : '',
          domeniuISCED: cells[12] ? cells[12].innerText.trim() : ''
        };
      } else if (cells.length === 12) {
        currentCodRSI = cells[0].innerText.trim();
        currentRSI = cells[1].innerText.trim();
        currentCodDSU = cells[2].innerText.trim();
        currentDSU = cells[3].innerText.trim();
        currentCodDL = cells[4].innerText.trim();
        currentDL = cells[5].innerText.trim();
        rowData = {
          codDFI: currentCodDFI,
          DFI: currentDFI,
          codRSI: currentCodRSI,
          RSI: currentRSI,
          codDSU: currentCodDSU,
          DSU: currentDSU,
          codDL: currentCodDL,
          DL: currentDL,
          codS: cells[6] ? cells[6].innerText.trim() : '',
          specializare: cells[7] ? cells[7].innerText.trim() : '',
          credite: cells[8] ? cells[8].innerText.trim() : '',
          codISCED: cells[9] ? cells[9].innerText.trim() : '',
          domeniuISCED: cells[10] ? cells[10].innerText.trim() : ''
        };
      } else if (cells.length === 10) {
        currentCodDSU = cells[0].innerText.trim();
        currentDSU = cells[1].innerText.trim();
        currentCodDL = cells[2].innerText.trim();
        currentDL = cells[3].innerText.trim();
        rowData = {
          codDFI: currentCodDFI,
          DFI: currentDFI,
          codRSI: currentCodRSI,
          RSI: currentRSI,
          codDSU: currentCodDSU,
          DSU: currentDSU,
          codDL: currentCodDL,
          DL: currentDL,
          codS: cells[4] ? cells[4].innerText.trim() : '',
          specializare: cells[5] ? cells[5].innerText.trim() : '',
          credite: cells[6] ? cells[6].innerText.trim() : '',
          codISCED: cells[7] ? cells[7].innerText.trim() : '',
          domeniuISCED: cells[8] ? cells[8].innerText.trim() : ''
        };
      } else if (cells.length === 8) {
        currentCodDL = cells[0].innerText.trim();
        currentDL = cells[1].innerText.trim();
        rowData = {
          codDFI: currentCodDFI,
          DFI: currentDFI,
          codRSI: currentCodRSI,
          RSI: currentRSI,
          codDSU: currentCodDSU,
          DSU: currentDSU,
          codDL: currentCodDL,
          DL: currentDL,
          codS: cells[2] ? cells[2].innerText.trim() : '',
          specializare: cells[3] ? cells[3].innerText.trim() : '',
          credite: cells[4] ? cells[4].innerText.trim() : '',
          codISCED: cells[5] ? cells[5].innerText.trim() : '',
          domeniuISCED: cells[6] ? cells[6].innerText.trim() : ''
        };
      } else if (cells.length === 6) {
        rowData = {
          codDFI: currentCodDFI,
          DFI: currentDFI,
          codRSI: currentCodRSI,
          RSI: currentRSI,
          codDSU: currentCodDSU,
          DSU: currentDSU,
          codDL: currentCodDL,
          DL: currentDL,
          codS: cells[0] ? cells[0].innerText.trim() : '',
          specializare: cells[1] ? cells[1].innerText.trim() : '',
          credite: cells[2] ? cells[2].innerText.trim() : '',
          codISCED: cells[3] ? cells[3].innerText.trim() : '',
          domeniuISCED: cells[4] ? cells[4].innerText.trim() : ''
        };
      }
      tableData.push(rowData);
  });
    
    return tableData;
  });

  fs.writeFileSync('nomenclator.json', JSON.stringify(data, null, 2), 'utf-8');
  fs.writeFileSync('domains.json', JSON.stringify(data1, null, 2), 'utf-8');

  console.log('Data has been saved to nomenclator.json');
  console.log('Data has been saved to domains.json');
  await browser.close();

  const readJSON = (filePath) => {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  };
  
  // Funcție pentru scrierea fișierului JSON
  const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  };

    // Funcție pentru eliminarea caracterelor specificate dintr-un string
    const cleanText = (text) => {
        if (text && !text.includes('(')) {
            text = text.replace(/\)/g, '');
          }
        return text ? text.replace(/\n/g, ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('ingine- rești', 'inginerești')
        .replace(/[0-9*\.]/g, '').trim(): '';
      };
  
  // Funcție pentru eliminarea caracterelor de linie nouă dintr-un string
  const normalizeDomain = (domain) => {
    return domain ? domain.toLowerCase()
    .replace('ingine- rești', 'inginerești')
    .replace('studiul patrimoniului (heritage studies)', 'studiul patrimoniului')
    .replace(/\n/g, ' ')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ş/g, 's')
    .replace(/ț/g, 't')
    .replace(/ţ/g, 't')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[*\)]/g, '')
    .replace(/[Ingineria\n\ncivilă]/g, 'inginerie civilă')
    .trim() : '';
  };
  
  // Citirea celor două fișiere JSON
  const facultatiData = readJSON('nomenclator.json');
  const domainsData = readJSON('domains.json');
  
  // Crearea unui obiect de mapare pentru prima înregistrare care corespunde
  const domainsMap = domainsData.reduce((acc, domain) => {
    const normalizedDL = normalizeDomain(domain.DL);
    if (!acc[normalizedDL]) {
      acc[normalizedDL] = domain;
    }
    return acc;
  }, {});
  
  // Fuziunea datelor pe baza corespondenței între "domeniul" și "domeniul de licență"
  const mergedData = facultatiData.map(facultate => {
    const normalizedDomain = normalizeDomain(facultate.domeniu);
    const domainMatch = domainsMap[normalizedDomain];
    if (domainMatch) {
        return {
          ...facultate,
          universitate: cleanText(facultate.universitate),
          facultate: cleanText(facultate.facultate),
          domeniu: cleanText(facultate.domeniu),
          specializare: cleanText(facultate.specializare),
          acreditare: cleanText(facultate.acreditare),
          formaInvatamant: cleanText(facultate.formaInvatamant),
          ramura: cleanText(domainMatch.RSI),
          domeniulFundamental: cleanText(domainMatch.DFI)
        };
      } else {
        return {
          ...facultate,
          universitate: cleanText(facultate.universitate),
          facultate: cleanText(facultate.facultate),
          domeniu: cleanText(facultate.domeniu),
          specializare: cleanText(facultate.specializare),
          acreditare: cleanText(facultate.acreditare),
          formaInvatamant: cleanText(facultate.formaInvatamant),
          ramura: "",
          domeniulFundamental: ""
        };
      }
    return facultate;
  });

  const fillMissingData = (data, defaultValues) => {
    Object.keys(data).forEach(key => {
      if (data[key] === "") {
        data[key] = defaultValues[key] || data[key];
      }
    });
    return data;
  };
  
  mergedData.forEach(item => {
    if (item.universitate === "UNIVERSITATEA POLITEHNICA DIN BUCUREŞTI" && item.numar ==="4" && item.specializare ==="Tehnologii şi sisteme de telecomunicaţii (în limba engleză)"
        && item.acreditare === "A" && item.formaInvatamant ==="IF" && item.credite==="240" && item.numarStudenti === "60") {
        item.facultate ="Facultatea de Electronică, Telecomunicaţii şi Tehnologia Informaţiei"
        item.domeniu ="Inginerie electronică, telecomunicații și tehnologii informaționale"
        item.ramura = "Inginerie electrică, electronică și telecomunicații"
        item.domeniulFundamental = "Științe inginerești"
    }
  });
  
  // Scrierea datelor combinate într-un nou fișier JSON
  writeJSON('merged.json', mergedData);
  
  console.log('Data has been merged and saved to merged.json');
}

scrapeData();