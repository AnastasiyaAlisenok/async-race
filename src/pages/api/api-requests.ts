import { Cars, CarsResponse, EngineInfo, Options, SuccessRace, Winner, WinnersResponse } from '../../types/types';

const URL = 'http://127.0.0.1:3000';

async function fetchApi<T>(requestUrl: string, options: Options): Promise<T> {
    return (await fetch(requestUrl, options)).json();
}

async function getCars(page: number, limit = 7): Promise<CarsResponse> {
    const resp = await fetch(`${URL}/garage?_page=${page}&_limit=${limit}`, { method: 'GET' });
    return {
        cars: await resp.json(),
        count: resp.headers.get('X-Total-Count'),
    };
}

async function createCar(car: { name: string; color: string }): Promise<Cars> {
    return fetchApi(`${URL}/garage`, {
        method: 'POST',
        body: JSON.stringify(car),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function deleteCar<T>(id: string): Promise<T> {
    return fetchApi(`${URL}/garage/${Number(id)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function getCar(id: string): Promise<Cars> {
    return fetchApi(`${URL}/garage/${Number(id)}`, { method: 'GET' });
}

async function updateCar(car: { name: string; color: string; id: number }): Promise<Cars> {
    return fetchApi(`${URL}/garage/${Number(car.id)}`, {
        method: 'PUT',
        body: JSON.stringify(car),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function setEngine(id: number, status: string): Promise<EngineInfo> {
    return fetchApi(`${URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
}

async function setDrive(id: number, status: string): Promise<SuccessRace> {
    const res = await fetch(`${URL}/engine?id=${id}&status=${status}`, { method: 'PATCH' });
    return res.status !== 200 ? { success: false, idCar: id } : { success: true, idCar: id };
}

async function getWinners(page: number, limit: number, sort: string, order: string): Promise<WinnersResponse> {
    const resp = await fetch(`${URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
        method: 'GET',
    });
    return {
        winners: await resp.json(),
        count: resp.headers.get('X-Total-Count'),
    };
}

async function getWinner(id: number): Promise<Winner> {
    return fetchApi(`${URL}/winners/${id}`, { method: 'GET' });
}

async function createWinner(winner: { id: number; wins: number; time: number }): Promise<Winner> {
    return fetchApi(`${URL}/winners`, {
        method: 'POST',
        body: JSON.stringify(winner),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function deleteWinner<T>(id: string): Promise<T> {
    return fetchApi(`${URL}/winners/${Number(id)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function updateWinner(winner: Winner): Promise<Winner> {
    return fetchApi(`${URL}/winners/${winner.id}`, {
        method: 'PUT',
        body: JSON.stringify(winner),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export {
    getCars,
    createCar,
    deleteCar,
    getCar,
    updateCar,
    setEngine,
    getWinners,
    getWinner,
    createWinner,
    deleteWinner,
    updateWinner,
    setDrive,
};

