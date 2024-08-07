export const fetchDashboardData = async (userIdParam, dealParam, setDashboardData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/dashboard_data/?${userIdParam}&${dealParam}`);
      const data = await response.json();
      setDashboardData(data)
    } catch (error) {
      console.error(error);
    }
  };
  