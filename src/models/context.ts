import { createContext } from 'react';

import { IContext } from '~/interfaces';

export const SelectionContext = createContext<IContext>(null);
