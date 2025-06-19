function generateSeating() {
  const columnCount = parseInt(document.getElementById('columnCount').value);
  const desksInput = document.getElementById('desksPerColumn').value;
  const desksArray = desksInput.split(',').map(x => parseInt(x.trim()));
  const startSeat = parseInt(document.getElementById('startSeat').value);
  const yourSeat = parseInt(document.getElementById('yourSeat').value);
  const warning = document.getElementById('warningMsg');
  const chart = document.getElementById('chart');
  chart.innerHTML = '';
  warning.innerText = '';

  // Input validation
  if (
    isNaN(columnCount) || isNaN(startSeat) || isNaN(yourSeat) ||
    desksArray.length !== columnCount ||
    desksArray.some(isNaN)
  ) {
    warning.innerText = "❗ Please enter valid input for all fields and ensure column count matches desks per column.";
    return;
  }

  const totalSeats = desksArray.reduce((a, b) => a + b, 0);
  if (yourSeat < startSeat || yourSeat >= startSeat + totalSeats) {
    warning.innerText = `❗ Your seat number (${yourSeat}) is outside the seating range (${startSeat} to ${startSeat + totalSeats - 1}).`;
    return;
  }

  function createArrangement(reverse = false) {
    const order = [];
    let seat = startSeat;
    const colIndices = [...Array(columnCount).keys()];
    if (reverse) colIndices.reverse();

    colIndices.forEach((colIdx, i) => {
      const deskCount = desksArray[colIdx];
      const topDown = i % 2 === 0;
      const deskSeats = [];

      for (let j = 0; j < deskCount; j++) {
        const row = topDown ? j : deskCount - 1 - j;
        deskSeats.push({ col: colIdx, row, seat: seat++ });
      }

      order.push(...deskSeats);
    });

    return order;
  }

  const arrangements = [
    { title: 'Left to Right', data: createArrangement(false) },
    { title: 'Right to Left', data: createArrangement(true) },
  ];

  arrangements.forEach(a => {
    const section = document.createElement('div');
    section.className = 'seating-section';

    const title = document.createElement('div');
    title.className = 'section-title';
    title.innerText = a.title;
    section.appendChild(title);

    const chartContainer = document.createElement('div');
    chartContainer.className = 'seating-chart';

    const cols = Array(columnCount).fill(0).map(() => []);
    a.data.forEach(d => cols[d.col].push(d));

    cols.forEach(col => {
      col.sort((a, b) => a.row - b.row);
      const colDiv = document.createElement('div');
      colDiv.className = 'column';
      col.forEach(desk => {
        const div = document.createElement('div');
        div.className = 'desk ' + (desk.seat === yourSeat ? 'green' : 'red');
        div.innerText = desk.seat;
        colDiv.appendChild(div);
      });
      chartContainer.appendChild(colDiv);
    });

    section.appendChild(chartContainer);
    chart.appendChild(section);
  });
}
