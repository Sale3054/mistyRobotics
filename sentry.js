 
 m i s t y . D e b u g ( " w a n d e r   s k i l l   s t a r t e d " ) ;  
 m i s t y . M o v e H e a d P o s i t i o n ( 5 , 0 , 0 , 1 0 0 ) ;  
  
 m i s t y . S t a r t F a c e R e c o g n i t i o n ( ) ;  
  
 v a r   d r i v e   =   t r u e ;  
  
 / /   I s s u e   c o m m a n d s   t o   c h a n g e   L E D   a n d   s t a r t   d r i v i n g  
 / / m i s t y . C h a n g e L E D ( 0 ,   2 5 5 ,   0 ) ;   / /   g r e e n ,   G O !  
 / / m i s t y . D r i v e ( 1 0 ,   0 ) ;  
  
 / /   R e g i s t e r   f o r   T i m e O f F l i g h t   d a t a   a n d   a d d   p r o p e r t y   t e s t s  
  
 f u n c t i o n   r e g i s t e r ( )   {  
         m i s t y . A d d P r o p e r t y T e s t ( " F r o n t T O F " ,   " S e n s o r P o s i t i o n " ,   " = = " ,   " C e n t e r " ,   " s t r i n g " ) ;  
         m i s t y . A d d P r o p e r t y T e s t ( " F r o n t T O F " ,   " D i s t a n c e I n M e t e r s " ,   " < = " ,   0 . 2 ,   " d o u b l e " ) ;  
         m i s t y . R e g i s t e r E v e n t ( " F r o n t T O F " ,   " T i m e O f F l i g h t " ,   1 0 0 ,   t r u e ) ;  
  
         m i s t y . A d d P r o p e r t y T e s t ( " F a c e R e c " ,   " P e r s o n N a m e " ,   " e x i s t s " ,   " " ,   " s t r i n g " ) ;  
         m i s t y . R e g i s t e r E v e n t ( " F a c e R e c " ,   " C o m p u t e r V i s i o n " ,   1 0 0 ,   t r u e ) ;  
  
 } ;  
  
 f u n c t i o n   _ F a c e R e c ( d a t a ) {  
         i f   ( d a t a . P r o p e r t y T e s t R e s u l t s [ 0 ] . P r o p e r t y V a l u e   = =   " u n k n o w n   p e r s o n " )  
         {            
                 m i s t y . D e b u g ( " I n t r u d e r   D e t e c t e d   ! ! " ) ;  
                 m i s t y . P l a y A u d i o C l i p ( " 0 0 2 - A h h h . w a v " ) ;  
                 m i s t y . C h a n g e D i s p l a y I m a g e ( " D i s d a i n f u l . p n g " ) ;  
         }   e l s e    
         {  
                 m i s t y . D e b u g ( d a t a . P r o p e r t y T e s t R e s u l t s [ 0 ] . P r o p e r t y V a l u e ) ;  
                 m i s t y . P l a y A u d i o C l i p ( " 0 3 2 - B e w b e w b e e e w . w a v " ) ;  
  
         }  
 } ;  
          
  
 / /   F r o n t T O F   c a l l b a c k   f u n c t i o n  
 f u n c t i o n   _ F r o n t T O F ( d a t a )    
 {  
         m i s t y . D e b u g ( " F r o n t T O F   c a l l e d " )  
         / /   G e t   p r o p e r t y   t e s t   r e s u l t s  
         l e t   f r o n t T O F   =   d a t a . P r o p e r t y T e s t R e s u l t s [ 0 ] . P r o p e r t y P a r e n t ;  
  
         / /   / /   P r i n t   d i s t a n c e   o b j e c t   w a s   d e t e c t e d   a n d   s e n s o r  
         m i s t y . D e b u g ( " D i s t a n c e "   +   f r o n t T O F . D i s t a n c e I n M e t e r s ) ;  
         m i s t y . D e b u g ( " S e n s o r "   +   f r o n t T O F . S e n s o r P o s i t i o n ) ;  
         / /   / /   I s s u e   c o m m a n d s   t o   c h a n g e   L E D   a n d   s t o p   d r i v i n g  
         d r i v e   =   f a l s e ;  
         i f   ( f r o n t T O F . D i s t a n c e I n M e t e r s   < =   0 . 2 )    
         {  
                 / /   m i s t y . S t o p ( ) ;  
                 m i s t y . C h a n g e L E D ( 2 5 5 ,   0 ,   0 ) ;   / /   r e d ,   S T O P !  
                 m i s t y . D r i v e T i m e ( - 1 0 , 3 0 , 2 0 0 0 ) ;  
                 m i s t y . P a u s e ( 2 0 0 0 ) ;  
  
         }  
         / /   m i s t y . D e b u g ( " e n d i n g   s k i l l   h e l l o w o r l d _ t i m e o f f l i g h t   " ) ;  
 } ;  
  
  
  
 r e g i s t e r ( ) ;  
 w h i l e ( d r i v e )  
 {  
         / / m i s t y . D r i v e ( 1 0 , 0 ) ;  
         m i s t y . C h a n g e L E D ( 0 ,   2 5 5 ,   0 ) ;  
         m i s t y . D r i v e T i m e ( 1 0 ,   0 ,   2 0 0 0 ) ;  
         m i s t y . P a u s e ( 2 0 0 0 ) ;  
 } 