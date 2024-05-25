const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://denisa-iordache.github.io/Nomenclator_2023_2024/');

  const data = await page.evaluate(() => {
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

  

  fs.writeFileSync('domains.json', JSON.stringify(data, null, 2), 'utf-8');

  console.log('Data has been saved to domains.json');
  await browser.close();
}

scrapeData();