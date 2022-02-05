import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total }) {
  return (
    <Card className="infoBox">
      <CardContent>
        <Typography color="textSecondary">{title}</Typography>
        <h2 className="infoBox-cases">{cases}</h2>

        <Typography className="infoBox-total" color="textSecondary">
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
