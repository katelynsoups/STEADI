export type buttonStats =
{
    id: number;
    text: string;
}
export const hazards : buttonStats[][] =  [
[
    {id: 0, text: "Stairs"},
    {id: 1, text: "Furniture blocking walkways"},
    {id: 2, text: "Rugs on the floor"},
    {id: 3, text: "Cords or wires on the floor"},
    {id: 4, text: "High/Unreachable Shelves"},
],
[
    {id: 5, text: "A sturdy step stool"}, //talk to chippy about phrasing
    {id: 6, text: "A light close to your bed"}, 
    {id: 7, text: "A nightlight on the way to the bathroom"},
    {id: 8, text: "Slippery tub or shower floor"},
]
]

export const getHazards = (page: number) =>
  hazards[page] ?? [];