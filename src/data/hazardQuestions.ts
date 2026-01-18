export type buttonStats =
{
    id: number;
    text: string;
}
export const hazards : buttonStats[][] =  [
[
    {id: 0, text: "Stairs"},
    {id: 1, text: "No nightlight walking to bathroom"},
    {id: 2, text: "Rugs on the floor"},
    {id: 3, text: "Walking over cords/wires"},
    {id: 4, text: "High/Unreachable Shelves"},
],
[
    {id: 5, text: "Slippery tub or shower"},
    {id: 6, text: "No step stools"},
    {id: 7, text: "No lights close to bed"},
    {id: 8, text: "Walking over cords/wires"},
]
]

export const getHazards = (page: number) =>
  hazards[page] ?? [];