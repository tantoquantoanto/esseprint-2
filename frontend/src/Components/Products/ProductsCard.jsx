import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; 
import { Button, Card } from "react-bootstrap";

const ProductsCard = ({ _id, name, description, basePrice, img, isLiked, category, onLikeToggle }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/products/${_id}`);
  };

  return (
    <Card className="product-card shadow-sm w-100" style={{ height: "450px" }}>
      <Card.Img
        variant="top"
        src={img}
        className="product-card-img"
        style={{ objectFit: "cover", height: "250px" }}
      />
      <Card.Body className="d-flex flex-column product-card-body">
        <Card.Title className="mb-2 text-truncate">{name}</Card.Title>
        <Card.Text className="text-muted mb-2 text-truncate">{description}</Card.Text>
        <Card.Text className="text-muted mb-2">{category}</Card.Text>
        <Card.Text className="text-muted mb-2">€{basePrice}</Card.Text>
        <Button onClick={onClick} variant="primary" className="mt-auto">
          Details
        </Button>
        <Heart
          onClick={() => onLikeToggle(_id)}
          size={24}
          color={isLiked ? "red" : "gray"}
          style={{ cursor: "pointer", marginTop: "10px" }}
        />
      </Card.Body>
    </Card>
  );
};

export default ProductsCard;
