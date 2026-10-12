import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';

import store from '../lib/store';

export const renderWithProvider = (element) => {
    return render(
        <Provider store={store}>
            {element}
        </Provider>
    )
}