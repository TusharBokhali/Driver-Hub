declare module "react-native-ratings" {
  import * as React from "react";
  import { ViewStyle } from "react-native";

  export interface RatingProps {
    type?: "star" | "rocket" | "bell" | "heart";
    ratingCount?: number;
    imageSize?: number;
    startingValue?: number;
    readonly?: boolean;
    fractions?: number;
    showRating?: boolean;
    onFinishRating?: (rating: number) => void;
    style?: ViewStyle;
  }

  export class Rating extends React.Component<RatingProps> {}
  export class AirbnbRating extends React.Component<RatingProps> {}
}
