import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; 
import { Button, Card } from "react-bootstrap";
import "./productsCss/productsCard.css"

const ProductsCard = ({ _id, name, description, basePrice, img, isLiked, category, onLikeToggle }) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/products/${_id}`);
  };

  return (
    <Card className="product-card shadow-sm w-100">
      <Card.Img
        variant="top"
        src={img}
        className="product-card-img"
      />
      <Card.Body className="product-card-body">
        <Card.Title className="product-card-title mb-2 text-truncate">{name}</Card.Title>
        <Card.Text className="product-card-category text-muted mb-2">{category}</Card.Text>
        <Card.Text className="product-card-price text-muted mb-2">€{basePrice}</Card.Text>
        <Button onClick={onClick} variant="primary" className="product-card-button mt-auto">
          Details
        </Button>
        <Heart
          onClick={() => onLikeToggle(_id)}
          size={24}
          className={`product-card-heart ${isLiked ? 'liked' : 'not-liked'}`}
        />
      </Card.Body>
    </Card>
  );
};

export default ProductsCard;
