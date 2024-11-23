import { signOut } from '@common/api/auth';
import { Button } from '@common/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import ReactApexChart from 'react-apexcharts';

const ProfilePage = () => {
  // Sample data for the bar chart
  const barChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    colors: ['#fecaca', '#fef9c3', '#bfdbfe'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Enojo', 'Felicidad', 'Tristeza'],
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
  };

  const barChartSeries = [
    {
      name: 'Emociones',
      data: [25, 15, 35],
    },
  ];

  // Sample data for the bubble chart
  const bubbleChartOptions = {
    chart: {
      type: 'bubble',
      toolbar: {
        show: false,
      },
    },
    colors: ['#ef4444', '#fbbf24', '#3b82f6'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 0.8,
    },
    xaxis: {
      show: false,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
  };

  const bubbleChartSeries = [
    {
      name: 'Enojo',
      data: [[4, 4, 80]],
    },
    {
      name: 'Felicidad',
      data: [[6, 6, 100]],
    },
    {
      name: 'Tristeza',
      data: [[8, 8, 60]],
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Tu perfil</h1>
        <Button onClick={signOut} variant='outline'>
          Cerrar sesión
        </Button>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Este mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={barChartOptions}
              series={barChartSeries}
              type='bar'
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tus emociones</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactApexChart
              options={bubbleChartOptions}
              series={bubbleChartSeries}
              type='bubble'
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
