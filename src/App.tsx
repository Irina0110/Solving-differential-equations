import './App.css'
import {presetGpnDefault, Theme} from "@consta/uikit/Theme";
import {Header, HeaderLogo, HeaderModule} from "@consta/uikit/Header";
import {Text} from "@consta/uikit/Text";
import {Select} from "@consta/uikit/Select";
import {useEffect, useState} from "react";
import {TextField} from "@consta/uikit/TextField";
import {Button} from "@consta/uikit/Button";
import {IconLineAndBarChart} from "@consta/uikit/IconLineAndBarChart";
import {queries} from "./services.tsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {faker} from "@faker-js/faker";
import {Line} from "react-chartjs-2";
import {Informer} from "@consta/uikit/Informer";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


interface itemProps {
    label: string;
    id: string;
}

interface resultProps {
    t: number[];
    x: number[][][];
}

function App() {
    const [items, setItems] = useState<itemProps[]>([{label: 'as', id: '1'}]);
    const [checkedUser, setCheckedUser] = useState<itemProps | null>(null);
    const [step, setStep] = useState<string | null>(null);
    const [fromPoint, setFromPoint] = useState<string | null>(null);
    const [toPoint, setToPoint] = useState<string | null>(null);
    const isDisableButton = !checkedUser || !fromPoint || !toPoint || !step;
    const [result, setResult] = useState<resultProps>();
    const [labels, setLabels] = useState<number[]>([]);
    const [firstLine, setFirstLine] = useState<number[]>([]);
    const [secondLine, setSecondLine] = useState<number[]>([]);
    const [thirdLine, setThirdLine] = useState<number[]>([]);
    const data = {
        labels,
        datasets: [
            {
                label: 'x(t)',
                data: firstLine,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'y(t)',
                data: secondLine,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'z(t)',
                data: thirdLine,
                borderColor: 'rgb(239,169,74)',
                backgroundColor: 'rgba(239,169,74, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Решение дифуров',
            },
        },
    };

    const handleGetPoints = () => {
        if (!isDisableButton) {
            queries.result({name: checkedUser.label, step: step, from: fromPoint, to: toPoint}).then(response => {
                setResult(response)
            })
        }
    }


    useEffect(() => {
        console.log(labels?.map(() => faker.datatype.number({min: -1000, max: 1000})))
        const dataLabels: number[] = [];
        const dataLine1: number[] = [];
        const dataLine2: number[] = [];
        const dataLine3: number[] = [];

        for (let i = 0; i < (result?.x?.length ?? 0); i++) {
            dataLine1?.push(result?.x?.[i]?.[0]?.[0] ?? 0);
            dataLine2?.push(result?.x?.[i]?.[0]?.[1] ?? 0);
            dataLine3?.push(result?.x?.[i]?.[0]?.[2] ?? 0);
            const label = result?.t?.[i] ?? 0;
            dataLabels?.push(parseFloat(label.toFixed(2)));
        }
        setLabels(dataLabels)
        setFirstLine(dataLine1);
        setSecondLine(dataLine2);
        setThirdLine(dataLine3);
    }, [result])

    useEffect(() => {
        queries.list().then(response => {
            const dataList: itemProps[] = [];
            response?.map((item: string) => dataList?.push({label: item, id: item}))
            setItems(dataList);
        })
    }, [])

    return (
        <Theme preset={presetGpnDefault}>
            <Header
                leftSide={
                    <>
                        <HeaderModule>
                            <HeaderLogo>
                                <Text as={'p'} size={'l'} weight={'bold'} color={'#22272b'}>
                                    Построение графика
                                </Text>
                            </HeaderLogo>
                        </HeaderModule>
                    </>
                }/>
            <div className={'main'}>
                <div className={'column'}>
                    <Text as={'label'} size={'m'} className={'column-label'}>
                        Вариант
                    </Text>
                    <Select
                        items={items}
                        value={checkedUser}
                        onChange={({value}) => setCheckedUser(value)}
                        placeholder={'Выберите вариант'}
                    />
                    <TextField
                        onChange={({value}: { value: string | null }) => setStep(value)}
                        type="number"
                        label="Шаг"
                        value={step}
                        incrementButtons={false}
                        placeholder="Введите шаг"
                    />
                    <TextField
                        onChange={({value}: { value: string | null }) => setFromPoint(value)}
                        type="number"
                        incrementButtons={false}
                        value={fromPoint}
                        label="Начальная точка (в секундах)"
                        placeholder="Введите начальную точку"
                    />
                    <TextField
                        onChange={({value}: { value: string | null }) => setToPoint(value)}
                        type="number"
                        label="Конечная точка (в секундах)"
                        incrementButtons={false}
                        value={toPoint}
                        placeholder="Введите конечную точку"
                    />
                    <Button label={'Рассчитать'} iconRight={IconLineAndBarChart} disabled={isDisableButton}
                            onClick={handleGetPoints}/>
                </div>
                {labels?.length !== 0 ?
                    <div className={'canvas'}>
                        <Line options={options} data={data}/>
                    </div>
                    :
                    <Informer status="system"
                              view="filled"
                              title={'Данные для построение графика отсутсвуют'}
                              label={'Заполните поля и выполните рассчет'}
                    />
                }
            </div>
        </Theme>
    )
}

export default App
