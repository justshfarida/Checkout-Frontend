export function cartReducer(state, action) {
//   state = [
//   { id: 1, name: "Sword", price: 10, quantity: 2 },
//   { id: 2, name: "Shield", price: 15, quantity: 1 }
// ];
  switch (action.type) {
    case "ADD": {
//       dispatch({
//   type: "ADD",
//   item: sword
// });
      const existing = state.find((item) => item.id === action.item.id);

      if (existing) {
        //this creates new array
        return state.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...state, { ...action.item, quantity: 1 }];
    }

    case "INCREMENT":
      // action = {
      //   type: "INCREMENT",
      //   id: 3
      // };
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case "DECREMENT":
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

    case "REMOVE":
      return state.filter((item) => item.id !== action.id);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}
