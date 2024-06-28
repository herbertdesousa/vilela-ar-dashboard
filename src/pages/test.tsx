import React from 'react';

// import { Container } from './styles';

// function array_move(arr: any[], old_index: number, new_index: number) {
//   if (new_index >= arr.length) {
//     let k = new_index - arr.length + 1;
//     // eslint-disable-next-line no-plusplus
//     while (k--) {
//       arr.push(undefined);
//     }
//   }
//   arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
//   return arr; // for testing
// }

const Test: React.FC = () => {
  const [arr, setArr] = React.useState([
    {
      key: '1',
      title: 'item 1 ',
      order: 0,
    },
    {
      key: '2',
      title: 'item 2',
      order: 1,
    },
    {
      key: '3',
      title: 'item 3',
      order: 3,
    },
    {
      key: '4',
      title: 'item 4',
      order: 2,
    },
    {
      key: '5',
      title: 'item 5',
      order: 4,
    },
  ]);

  const moveUp = (key: string, up_item_index: number) => {
    setArr(st =>
      st.map((i, idx) => {
        if (i.key === key) return { ...i, order: i.order - 1 };
        if (up_item_index === idx) return { ...i, order: i.order + 1 };
        return i;
      }),
    );
  };

  const moveDown = (key: string, down_item_index: number) => {
    setArr(st =>
      st.map((i, idx) => {
        if (i.key === key) return { ...i, order: i.order + 1 };
        if (down_item_index === idx) return { ...i, order: i.order - 1 };
        return i;
      }),
    );
  };

  return (
    <div>
      <ul>
        {arr
          .sort((a, b) => a.order - b.order)
          .map((item, index) => (
            <li key={item.key}>
              {item.title}
              &nbsp;&nbsp;
              <button
                type="button"
                onClick={() => moveUp(item.key, index - 1)}
                disabled={index === 0}
                className={index === 0 ? 'text-accent-3' : 'text-accent-6'}
              >
                Subir
              </button>
              &nbsp;&nbsp;
              <button
                type="button"
                onClick={() => moveDown(item.key, index + 1)}
                disabled={index === arr.length - 1}
                className={
                  index === arr.length - 1 ? 'text-accent-3' : 'text-accent-6'
                }
              >
                Descer
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Test;
