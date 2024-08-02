export const onDealCreation = async ({ userIdParam, deal }) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deal,
        }),
      };
      console.log(options);
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/deals/create?${userIdParam}`, options);
      console.log(response);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

export const fetchDeals = async (userIdParam, setDeals) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/deals/?${userIdParam}`);
    const data = await response.json();
    setDeals(data.deals || []);
  } catch (error) {
    console.error(error);
  }
};

export const deleteDeal = async ( userIdParam, deal ) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deal,
        }),
      };
      console.log(options);
      const response = await fetch(`${import.meta.env.VITE_BACK_API_URL}/deals/delete?${userIdParam}`, options);
      console.log(response);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };