import sys
import json
from prophet import Prophet
import pandas as pd

month = int(sys.argv[1])
year = int(sys.argv[2])

# Read data from stdin
data = json.loads(sys.stdin.read())

# Convert data to DataFrame
df = pd.DataFrame(data)
df = df.drop(columns=["count"])
df.rename(columns={"day": "ds", "hour": "y"}, inplace=True)
df["ds"] = pd.to_datetime(df["ds"])

# Train the Prophet model
model = Prophet()
model.fit(df)

# Create future DataFrame
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

# Extract forecasted peak hours
forecasted_peak_hours = forecast[["ds", "yhat"]].copy()
forecasted_peak_hours.loc[:, "peak_hour"] = forecasted_peak_hours["yhat"].round().astype(int)

# Filter forecasts by the requested month (if month was provided)
if month:
    forecasted_peak_hours = forecasted_peak_hours[
        (forecasted_peak_hours['ds'].dt.month == month) & (forecasted_peak_hours['ds'].dt.year == year)
    ]

# Convert 'ds' column (timestamp) to readable date format 'YYYY-MM-DD'
forecasted_peak_hours["ds"] = forecasted_peak_hours["ds"].dt.strftime('%Y-%m-%d')

# Output result
print(forecasted_peak_hours.to_json(orient="records"))