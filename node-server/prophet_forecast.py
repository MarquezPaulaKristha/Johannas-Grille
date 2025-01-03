import sys
import json
from prophet import Prophet
import pandas as pd

month = int(sys.argv[1])
year = int(sys.argv[2])  # Get year as an argument

# Read data from stdin
data = json.loads(sys.stdin.read())

# Convert data to DataFrame
df = pd.DataFrame(data)

# Log the columns of the DataFrame for debugging
sys.stderr.write(f"Columns in the DataFrame: {df.columns.tolist()}\n")

# Check if the 'day' column exists, then rename it to 'ds'
if 'day' in df.columns:
    df.rename(columns={"day": "ds"}, inplace=True)
else:
    sys.stderr.write("Warning: 'day' column not found in the DataFrame.\n")

# Check for 'count' column existence and drop it
if 'count' in df.columns:
    df = df.drop(columns=["count"])

# Ensure 'ds' column exists and convert it to datetime
if 'ds' in df.columns:
    df["ds"] = pd.to_datetime(df["ds"])
else:
    raise KeyError("'ds' column is missing after renaming or data preprocessing.")

# Check if 'y' column exists and rename if necessary
if 'hour' in df.columns:
    df.rename(columns={"hour": "y"}, inplace=True)
else:
    sys.stderr.write("Warning: 'hour' column not found in the DataFrame.\n")

# Remove rows with NaN values in 'ds' or 'y' columns
df = df.dropna(subset=["ds", "y"])

# Log the dataframe shape and head after cleaning to stderr
# sys.stderr.write(f"Dataframe shape after cleaning: {df.shape}\n")
# sys.stderr.write(f"Dataframe head after cleaning:\n{df.head()}\n")

# Check if there are enough rows
if df.shape[0] < 2:
    raise ValueError("Dataframe has less than 2 non-NaN rows.")

# Train the Prophet model
model = Prophet()
model.fit(df)

# Create future DataFrame
future = model.make_future_dataframe(periods=30)
forecast = model.predict(future)

# Extract forecasted peak hours
forecasted_peak_hours = forecast[["ds", "yhat"]].copy()
forecasted_peak_hours.loc[:, "peak_hour"] = forecasted_peak_hours["yhat"].round().astype(int)

# Filter forecasts by the requested year and month
if month and year:
    forecasted_peak_hours = forecasted_peak_hours[
        (forecasted_peak_hours['ds'].dt.month == month) & (forecasted_peak_hours['ds'].dt.year == year)
    ]

# Convert 'ds' column (timestamp) to readable date format 'YYYY-MM-DD'
forecasted_peak_hours["ds"] = forecasted_peak_hours["ds"].dt.strftime('%Y-%m-%d')

# Output result as JSON
print(forecasted_peak_hours.to_json(orient="records"))
